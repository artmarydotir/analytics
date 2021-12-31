<template>
  <v-app class="bodybg">
    <v-main>
      <v-container fluid class="mt-0 ml-0 mr-0 pl-0 pt-0 pr-0">
        <nuxt />
        <IntroFooter />
      </v-container>
    </v-main>
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
    console.log(this.$store.getters['user/auth/GET_AUTHENTICATED']);
    // if has token, then redirect to dashboard
    if (this.$store.getters['user/auth/GET_AUTHENTICATED']) {
      console.log('has token');
      this.$router.push(
        this.localeRoute({
          name: 'dashboard',
        }),
      );
    }
  },
};
</script>
<style lang="scss" scoped>
.bodybg {
  background: rgb(244, 246, 248);
}
</style>
