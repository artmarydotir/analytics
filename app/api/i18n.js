// const util = require('util');
// const path = require('path');
// // eslint-disable-next-line security/detect-child-process
// const exec = util.promisify(require('child_process').exec);

// const YAML = require('yaml');

// const load = async () => {
//   const { stdout: defaultFilesList } = await exec(
//     'find /app/api/i18n/defaults -type f -name *.yml',
//   );
//   const defaultFiles = defaultFilesList
//     .trim()
//     .split('\n')
//     .filter((f) => f.length >= 1)
//     .map((f) => ({
//       lang: f.match(/\/([a-z]{2})\/[^/]+/)[1],
//       namespace: path.basename(f, '.yml'),
//     }));
//   const { stdout: addonFilesList } = await exec(
//     'find /app/api/i18n/addon -type f -name *.yml',
//   );
//   const addonFiles = addonFilesList
//     .trim()
//     .split('\n')
//     .filter((f) => f.length >= 1)
//     .map((f) => ({
//       lang: f.match(/\/([a-z]{2})\/[^/]+/)[1],
//       namespace: path.basename(f, '.yml'),
//     }));

//   return {
//     defaults: defaultFiles,
//     addons: addonFiles,
//   };
// };

// load();

const i18next = require('i18next');

const resources = require('./i18n/dist/resources.json');

i18next.init(
  {
    lng: 'fa',
    // debug: true,
    resources,
  },
  (err, t) => {
    console.log(t('sms.activisionCodeMessage', { code: 1111 }));
  },
);
