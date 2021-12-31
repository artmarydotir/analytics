<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <DomainForm
      :title="$t('domainAdd')"
      :adding-confirmation="true"
      main-icon="domain-plus"
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
      title: this.$t('domainAdd'),
    };
  },
};
</script>
