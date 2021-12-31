<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <ProjectForm
      :title="$t('projectAdd')"
      :adding-confirmation="true"
      main-icon="file-table-box"
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
      title: this.$t('projectAdd'),
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
          text: this.$t('projectList'),
          to: '/project/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('projectAdd'),
          to: `/project/add`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
