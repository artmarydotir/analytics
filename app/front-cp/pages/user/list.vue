<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <UserList
      :headers="headers"
      :general-action="generalAction"
      :module-info="moduleData"
      main-icon="account-details"
    >
    </UserList>
  </v-container>
</template>

<script>
import listInfo from '@/mixin/userListInfo';
export default {
  mixins: [listInfo],
  permissions: ['AD', 'SA'],
  data() {
    return {
      moduleData: {
        url: 'user/list/listUser',
        rmUrl: 'user/deleteUser',
        name: 'userEntity',
      },
      generalAction: {
        title: 'userList',
        addLink: 'user-add',
        editLink: '/user/edit',
        linkTitle: 'userAdd',
        deletable: true,
        editable: true,
      },
    };
  },
  head() {
    return {
      title: `${this.$t('userList')}`,
    };
  },
};
</script>
