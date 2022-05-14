import '@mdi/font/css/materialdesignicons.css';
import colors from 'vuetify/es5/util/colors';

// vuetify.options.js
export default function ({ app, store }) {
  return {
    icons: {
      iconfont: 'mdi',
      // only woff2 is supported
    },
    rtl: app.$config.dir === 'rtl',

    theme: {
      dark: false,
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          primary: '#536dfe',
          secondary: colors.amber.darken3,
          middle: '#ff5992',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: colors.indigo.lighten5,
        },
        dark: {
          primary: '#536dfe',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.pink.accent3,
          success: colors.green.darken2,
          background: '#121212',
        },
      },
    },
  };
}

// --v-anchor-base: #9155fd;
// --v-primary-base: #9155fd;
// --v-secondary-base: #8a8d93;
// --v-accent-base: #0d6efd;
// --v-error-base: #ff4c51;
// --v-info-base: #16b1ff;
// --v-success-base: #56ca00;
// --v-warning-base: #ffb400;
