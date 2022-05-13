import { by639_1 as By639 } from 'iso-language-codes';
import {
  defaultLocale,
  supportedLocales,
  defaultLocaleProjectInfo,
} from './init';

const locales = [];

supportedLocales.forEach((code) => {
  locales.push({
    code,
    iso: By639[code].iso639_1,
    name: By639[code].name,
    nativeName: By639[code].nativeName,
    file: `${code}/index.js`,
  });
});

export const localeProjectInfo = defaultLocaleProjectInfo;

export const I18N = {
  vuex: {
    moduleName: 'i18n',
    syncLocale: true,
    syncMessages: true,
    syncRouteParams: true,
  },
  detectBrowserLanguage: false,
  alwaysRedirect: true,
  locales,
  lazy: true,
  seo: true,
  langDir: './locales/',
  defaultLocale,
  parsePages: true,
  strategy: 'prefix',
  vueI18nLoader: true,
};
