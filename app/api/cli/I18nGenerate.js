const util = require('util');
const path = require('path');
const fsp = require('fs').promises;
// eslint-disable-next-line security/detect-child-process
const exec = util.promisify(require('child_process').exec);

const { merge } = require('lodash');
const YAML = require('yaml');

// eslint-disable-next-line no-unused-vars
const chalk = require('chalk');

// eslint-disable-next-line no-unused-vars
const { log } = console;

const listOfFiles = async () => {
  const { stdout: defaultFilesList } = await exec(
    'find /app/api/i18n/defaults -type f -name *.yml',
  );
  const defaultFiles = defaultFilesList
    .trim()
    .split('\n')
    .filter((f) => f.length >= 1)
    .map((f) => ({
      lang: f.match(/\/([a-z]{2})\/[^/]+/)[1],
      namespace: path.basename(f, '.yml'),
    }));
  const { stdout: addonFilesList } = await exec(
    'find /app/api/i18n/addon -type f -name *.yml',
  );
  const addonFiles = addonFilesList
    .trim()
    .split('\n')
    .filter((f) => f.length >= 1)
    .map((f) => ({
      lang: f.match(/\/([a-z]{2})\/[^/]+/)[1],
      namespace: path.basename(f, '.yml'),
    }));

  return {
    defaults: defaultFiles,
    addons: addonFiles,
  };
};

const loadFile = async (source) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const content = await fsp.readFile(source, 'utf8');
  return YAML.parse(content);
};

module.exports = {
  name: 'i18n',
  description: 'Generate i18n data',
  /**
   * @param {import('awilix').AwilixContainer} container
   * @param {Object} options
   */
  // eslint-disable-next-line no-unused-vars
  async runAction(container, options) {
    const { defaults, addons } = await listOfFiles();
    let promises = [];
    const result = {};

    defaults.forEach(({ lang, namespace }) => {
      // eslint-disable-next-line security/detect-object-injection
      if (!result[lang]) {
        // eslint-disable-next-line security/detect-object-injection
        result[lang] = {};
        // eslint-disable-next-line security/detect-object-injection
        result[lang].translation = {};
      }

      promises.push(
        new Promise((resolve) => {
          loadFile(`/app/api/i18n/defaults/${lang}/${namespace}.yml`).then(
            (data) => {
              // eslint-disable-next-line security/detect-object-injection
              result[lang].translation[namespace] = data;
              resolve();
            },
          );
        }),
      );
    });

    await Promise.all(promises);

    promises = [];

    addons.forEach(({ lang, namespace }) => {
      promises.push(
        new Promise((resolve) => {
          loadFile(`/app/api/i18n/addon/${lang}/${namespace}.yml`).then(
            (data) => {
              // eslint-disable-next-line security/detect-object-injection
              result[lang].translation[namespace] = merge(
                // eslint-disable-next-line security/detect-object-injection
                result[lang].translation[namespace],
                data,
              );
              resolve();
            },
          );
        }),
      );
    });

    await Promise.all(promises);

    await fsp.writeFile(
      '/app/api/i18n/dist/resources.json',
      `${JSON.stringify(result, null, 2)}\n`,
      { encoding: 'utf8' },
    );
  },
};
