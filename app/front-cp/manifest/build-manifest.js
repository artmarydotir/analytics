#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const projectDir = path.resolve(`${__dirname}/..`);

const config = JSON.parse(
  fs.readFileSync(`${__dirname}/config.json`, { encoding: 'utf8' }),
);

const supportedLocales = process.env.ASM_BUILD_SUPPORTED_LOCALES
  ? process.env.ASM_BUILD_SUPPORTED_LOCALES.trim()
      .split(',')
      .map((l) => l.trim())
  : ['fa', 'en'];

supportedLocales.forEach((lang) => {
  const fileName = `manifest-${lang}.json`;
  const localeDate = require(`${projectDir}/locales/${lang}/index.js`);
  const manifestData = _.merge(_.cloneDeep(config.web_app_manifests), {
    name: localeDate.projectName,
    short_name: localeDate.projectShortName,
    description: localeDate.projectDescription,
    dir: localeDate.dir,
    icons: [],
  });
  Object.keys(config.icons).forEach((name) => {
    const size = config.icons[name];
    manifestData.icons.push({
      src: `/_icons/${name}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
    });
  });
  fs.writeFileSync(
    `${projectDir}/static/${fileName}`,
    JSON.stringify(manifestData),
  );
});
