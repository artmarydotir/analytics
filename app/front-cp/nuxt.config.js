import { I18N, localeProjectInfo } from './i18n/config';
import manifest from './manifest/config.json';

const headLinks = [
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  {
    rel: 'manifest',
    hid: 'manifest',
    href: `/manifest-${localeProjectInfo.lang}.json`,
  },
];

Object.keys(manifest.icons).forEach((name) => {
  const size = manifest.icons[name];
  headLinks.push({
    rel: 'shortcut icon',
    sizes: `${size}x${size}`,
    href: `/_cp/_icons/${name}.png`,
  });
});

export default {
  ssr: false,
  target: 'static',
  router: {
    base: '/_cp',
    mode: 'hash',
    middleware: ['direction'],
  },
  server: {
    port: parseInt(process.env.ASM_FRONT_CP_PORT, 10) || 3000,
    host: '0.0.0.0',
  },
  publicRuntimeConfig: {
    dir: localeProjectInfo.dir,
    lang: localeProjectInfo.lang,
  },
  head: {
    titleTemplate: `%s - ${localeProjectInfo.projectName}`,
    title: localeProjectInfo.loading,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui',
      },
      {
        hid: 'description',
        name: 'description',
        content: localeProjectInfo.projectDescription,
      },
      {
        hid: 'robots',
        name: 'robots',
        content: 'noindex,nofollow',
      },
    ],
    link: headLinks,
  },

  css: ['@aasaam/noto-font/dist/font-face.css', '~/assets/main.scss'],

  plugins: [
    { src: '~/plugins/vuex-persist.js' },
    '~/plugins/vee-validate.js',
    { src: '~/plugins/axios.js', ssr: false },
  ],
  components: {
    dirs: [
      '~/components',
      '~/components/Structure',
      '~/components/Global',
      '~/components/Auth',
      '~/components/User',
      '~/components/User/Update',
      '~/components/Project',
      '~/components/Domain',
      '~/components/Uptime',
      '~/components/Performance',
      '~/components/Charts',
      '~/components/Dashboard',
      '~/components/Dashboard/Home',
    ],
  },

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
  ],

  modules: ['@nuxtjs/axios', ['nuxt-i18n', I18N]],

  loading: {
    color: process.env.ASM_BUILD_NUXT_LOADING_COLOR
      ? process.env.ASM_BUILD_NUXT_LOADING_COLOR
      : '#00bcd4',
    failedColor: process.env.ASM_BUILD_NUXT_LOADING_FAILED_COLOR
      ? process.env.ASM_BUILD_NUXT_LOADING_FAILED_COLOR
      : '#ff9800',
    height: '8px',
    rtl: localeProjectInfo.dir === 'rtl',
  },

  axios: {
    baseURL: '',
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    optionsPath: './plugins/vuetify.js',
    defaultAssets: false,
    treeShake: true,
  },

  build: {
    // transpile: [/echarts/, /zrender/],
  },
};
