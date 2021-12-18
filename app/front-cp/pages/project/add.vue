<template>
  <v-container class="pt-6" fluid>
    <ProjectForm :title="$t('projectAdd')" :adding-confirmation="true" />
  </v-container>
</template>
<script>
export default {
  permissions: ['AD', 'SA'],
  data() {
    return {};
  },
  head() {
    return {
      title: this.$t('projectAdd'),
    };
  },
};
</script>
