<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <UptimeForm :title="$t('uptimeAdd')" main-icon="monitor-eye" />
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
      title: this.$t('uptimeAdd'),
    };
  },
};
</script>
