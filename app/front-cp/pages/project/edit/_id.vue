<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />
    {{ projectId }}
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      projectId: Number(this.$route.params.id),
    };
  },
  head() {
    return {
      title: this.$t('editProject'),
    };
  },
};
</script>
