const rtlLanguagesRoutes = /^\/(ar|dv|fa|he|ps|ur|yi)/;

export default function ({ app, route }) {
  // check for rtl language
  if (rtlLanguagesRoutes.test(route.path)) {
    app.vuetify.framework.rtl = true;
  } else {
    app.vuetify.framework.rtl = false;
  }
}
