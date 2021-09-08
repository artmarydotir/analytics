import '@mdi/font/css/materialdesignicons.css';
import colors from 'vuetify/es5/util/colors';

// vuetify.options.js
export default function ({ app, store }) {
  return {
    icons: {
      iconfont: 'mdi',
    },
    rtl: app.$config.dir === 'rtl',

    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  };
}
