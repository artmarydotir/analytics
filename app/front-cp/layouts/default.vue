<template>
  <v-app app>
    <Nav />
    <AppBar />

    <v-main>
      <v-container fluid>
        <!-- <Snackbar /> -->
        <nuxt />
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>
<script>
const rtlLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];
export default {
  middleware: ['acl', 'check-token'],
  data() {
    return {
      timer: null,
    };
  },
  head() {
    const i18nSeo = this.$nuxtI18nSeo();
    return {
      htmlAttrs: {
        dir: rtlLanguages.includes(this.$i18n.locale) ? 'rtl' : 'ltr',
        lang: this.$i18n.locale,
        ...i18nSeo.htmlAttrs,
      },
    };
  },

  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },
  mounted() {
    this.$vuetify.theme.dark = this.$store.state.helper.darkMode;
  },
  created() {
    this.runTimer();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    runTimer() {
      this.timer = setInterval(() => {
        console.log(['timer', new Date()]);
        this.$store.dispatch('user/auth/refreshToken');
      }, 1 * 60 * 1000);
      // }, 5 * 60 * 1000);
    },
  },
};
</script>
