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
          text: this.$t('domainList'),
          to: '/domain/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('domainAdd'),
          to: '/domain/add',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
