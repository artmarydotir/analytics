const allRTLLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];

const supportedLocales = process.env.ASM_BUILD_SUPPORTED_LOCALES
  ? process.env.ASM_BUILD_SUPPORTED_LOCALES.trim()
      .split(',')
      .map((l) => l.trim())
  : ['fa', 'en'];

const defaultLocale = process.env.ASM_BUILD_DEFAULT_LOCALE
  ? process.env.ASM_BUILD_DEFAULT_LOCALE
  : 'en';

const rtlLanguages = [];
const ltrLanguages = [];
supportedLocales.forEach((l) => {
  if (allRTLLanguages.includes(l)) {
    rtlLanguages.push(l);
  } else {
    ltrLanguages.push(l);
  }
});

export default function ({ app, route, store }) {
  const input = route.path.split('/')[1];

  let applicationLanguage = defaultLocale;

  if (supportedLocales.includes(input)) {
    applicationLanguage = input;
  }

  app.i18n.locale = applicationLanguage;

  app.vuetify.framework.rtl = rtlLanguages.includes(applicationLanguage);
}
