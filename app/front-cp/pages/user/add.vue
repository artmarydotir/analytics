<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <UserForm :title="$t('userAdd')" main-icon="account-plus" />
  </v-container>
</template>
<script>
export default {
  permissions: ['AD', 'SA'],
  head() {
    return {
      title: `${this.$t('userAdd')}`,
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
          text: this.$t('userList'),
          to: '/user/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('userAdd'),
          to: `/user/add`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
</script>
