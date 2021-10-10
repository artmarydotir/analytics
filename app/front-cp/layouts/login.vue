<template>
  <v-app class="bodybg">
    <nuxt />
    <v-footer
      padless
      color="deep-purple"
      :fixed="$vuetify.breakpoint.lgAndUp ? true : false"
    >
      <v-col class="text-center" cols="12">
        <span class="white--text">
          {{ $t('projectDescription') }}
        </span>
      </v-col>
    </v-footer>
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
  background: linear-gradient(
    90deg,
    rgb(142, 90, 238) 0%,
    rgb(81, 20, 194) 100%
  );
}
</style>
