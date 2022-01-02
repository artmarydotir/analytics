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
          text: this.$t('uptimeAdd'),
          to: `/uptime/add`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
