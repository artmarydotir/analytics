<template>
  <v-app dark>
    <!-- {{ $t('pageNotFound') }} -->
    <h1 v-if="error.statusCode === 403">403: forbidden</h1>
    <!-- <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1> -->
    <h1 v-else>
      {{ $t('otherError') }}
    </h1>
    <NuxtLink :to="localePath('/')"> Home page </NuxtLink>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // pageNotFound: this.$t('pageNotFound'),
      otherError: 'An error occurred',
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
