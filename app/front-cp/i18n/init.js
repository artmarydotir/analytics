import { resolve } from 'path';

export const defaultLocale = process.env.ASM_BUILD_DEFAULT_LOCALE
  ? process.env.ASM_BUILD_DEFAULT_LOCALE
  : 'fa';

export const supportedLocales = process.env.ASM_BUILD_SUPPORTED_LOCALES
  ? process.env.ASM_BUILD_SUPPORTED_LOCALES.trim()
      .split(',')
      .map((l) => l.trim())
  : ['fa', 'en'];

const defaultLocaleData = require(resolve(
  // eslint-disable-next-line node/no-path-concat
  `${__dirname}/../locales/${defaultLocale}/index.js`,
));

export const defaultLocaleProjectInfo = {
  projectName: defaultLocaleData.projectName,
  projectDescription: defaultLocaleData.projectDescription,
  loading: defaultLocaleData.loading,
  dir: defaultLocaleData.dir,
  lang: defaultLocale,
};
