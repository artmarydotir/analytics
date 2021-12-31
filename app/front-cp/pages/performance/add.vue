<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <PerformanceForm
      :title="$t('performanceAdd')"
      main-icon="chart-box-plus-outline"
    />
  </v-container>
</template>
<script>
export default {
  permissions: ['AD', 'SA'],

  head() {
    return {
      title: this.$t('performanceAdd'),
    };
  },
  computed: {
    crumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/dashboard',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('performanceList'),
          to: '/performance/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('performanceAdd'),
          to: '/performance/add',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
