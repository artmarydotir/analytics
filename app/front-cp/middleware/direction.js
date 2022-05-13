const allRTLLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];

export default function ({ app, route, store, redirect }) {
  const supportedLocales = app.$config
    ? app.$config.supportedLocales
    : ['fa', 'en'];

  const defaultLocale = app.$config ? app.$config.lang : 'en';

  const rtlLanguages = [];
  const ltrLanguages = [];

  supportedLocales.forEach((l) => {
    if (allRTLLanguages.includes(l)) {
      rtlLanguages.push(l);
    } else {
      ltrLanguages.push(l);
    }
  });

  const input = route.path.split('/')[1]
    ? route.path.split('/')[1]
    : app.$config.lang;

  let applicationLanguage = defaultLocale;

  if (supportedLocales.includes(input)) {
    applicationLanguage = input;
  }

  app.i18n.setLocale(applicationLanguage);

  app.vuetify.framework.rtl = rtlLanguages.includes(applicationLanguage);

  if (route.path === '/') {
    return redirect(`/${defaultLocale}`);
  }
}
