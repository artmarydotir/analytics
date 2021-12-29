<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />

    {{ uptime }}
    <template v-if="loading">
      <UptimeForm
        :title="$t('uptimeEdit')"
        :edit-mood="true"
        :uptime="uptime"
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
      uptime: {},
      loading: false,
      uptimeId: Number(this.$route.params.id),
    };
  },
  head() {
    return {
      title: this.$t('uptimeEdit'),
    };
  },
  async mounted() {
    this.loading = false;
    if (this.uptimeId) {
      const result = await this.$store.dispatch(
        'uptime/showUptimeProfile',
        this.uptimeId,
      );
      if (result) {
        this.loading = true;
      }
      this.uptime = { ...result };
    }
  },
};
</script>
