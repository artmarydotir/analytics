<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />

    <template v-if="loading">
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
