<template>
  <v-container class="pt-6" fluid>
    <Breadcrumb />
    <UptimeForm :title="$t('uptimeAdd')" main-icon="sort-clock-descending" />
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
