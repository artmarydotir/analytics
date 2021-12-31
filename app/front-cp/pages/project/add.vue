<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <ProjectForm
      :title="$t('projectAdd')"
      :adding-confirmation="true"
      main-icon="file-table-box"
    />
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
