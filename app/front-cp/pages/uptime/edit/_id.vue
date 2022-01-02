<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />

    <template v-if="loading">
      <StaticBreadCrumb :crumbs="crumbs" />
      <UptimeForm
        :title="$t('uptimeEdit')"
        :edit-mood="true"
        :uptime="uptime"
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
          text: this.$t('uptimeList'),
          to: '/uptime/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('uptimeEdit'),
          to: `/uptime/edit/${this.uptimeId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
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
