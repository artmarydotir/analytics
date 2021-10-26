<template>
  <v-app class="bodybg">
    <nuxt />
    <IntroFooter />
  </v-app>
</template>

<script>
export default {
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },
  mounted() {
    const theme = localStorage.getItem('dark_theme');
    if (theme) {
      if (theme === 'true') {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.bodybg {
  background: rgb(244, 246, 248);
}
</style>
