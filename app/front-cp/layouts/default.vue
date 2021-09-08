<template>
  <v-app>
    <GlobalNav />
    <GlobalAppBar />

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <GlobalFooter />
  </v-app>
</template>
<script>
const rtlLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];
export default {
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
};
</script>
