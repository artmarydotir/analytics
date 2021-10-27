<template>
  <v-app app>
    <Nav />
    <AppBar />

    <v-main>
      <v-container fluid>
        <Snackbar />
        <nuxt />
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>
<script>
const rtlLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];
export default {
  data() {
    return {
      polling: null,
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
};
</script>
