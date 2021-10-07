<template>
  <v-app class="body_bg bodybg">
    <nuxt />
    <v-footer
      padless
      color="#0d0a19de"
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
  // computed: {
  //   theme() {
  //     return this.$vuetify.theme.dark ? 'dark' : 'light';
  //   },
  // },
  // mounted() {
  //   const theme = localStorage.getItem('dark_theme');
  //   if (theme) {
  //     if (theme === 'true') {
  //       this.$vuetify.theme.dark = true;
  //     } else {
  //       this.$vuetify.theme.dark = false;
  //     }
  //   }
  // },
};
</script>
<style lang="scss" scoped>
.bodybg {
  background-color: #1d1e2f !important;
}
// .body_bg {
//   // background-image: url('/_cp/bg1.png');
//   background-image: url('../assets/images/bg1.png');
//   background-repeat: no-repeat;
//   background-position: top left;
//   // background-image: linear-gradient(#111116, #272a66);
// }
</style>
