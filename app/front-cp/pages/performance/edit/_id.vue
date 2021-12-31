<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />

    <template v-if="loading">
      <StaticBreadCrumb :crumbs="crumbs" />
      <PerformanceForm
        :title="$t('performanceEdit')"
        :edit-mood="true"
        :performance="performance"
        main-icon="monitor-edit"
      />
    </template>
    <template v-else>
      {{ $t('noResult') }}
    </template>
  </v-container>
</template>

<script>
export default {
  permissions: ['AD', 'SA'],
  data() {
    return {
      performance: {},
      loading: false,
      performanceId: Number(this.$route.params.id),
    };
  },
  head() {
    return {
      title: this.$t('performanceEdit'),
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
          text: this.$t('performanceEdit'),
          to: `/performance/edit/${this.performanceId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
  async mounted() {
    this.loading = false;
    if (this.performanceId) {
      const result = await this.$store.dispatch(
        'performance/showPerformanceProfile',
        this.performanceId,
      );
      if (result) {
        this.loading = true;
      }
      this.performance = { ...result };
    }
  },
};
</script>
