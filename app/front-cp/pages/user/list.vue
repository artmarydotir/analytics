<template>
  <v-container class="pt-6" fluid>
    <UserList
      :headers="headers"
      :general-action="generalAction"
      :module-info="moduleData"
    >
    </UserList>
  </v-container>
</template>
<script>
export default {
  // permissions: ['SA', 'AD', 'VI'],
  data() {
    return {
      moduleData: {
        url: 'user/list/listUser',
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
  computed: {
    headers() {
      return [
        {
          text: this.$t('id'),
          sortable: false,
          value: 'id',
        },
        {
          text: this.$t('username'),
          sortable: false,
          value: 'username',
          type: 'text',
        },
        {
          text: this.$t('email'),
          sortable: false,
          value: 'email',
          type: 'text',
        },
        {
          text: this.$t('mobile'),
          sortable: false,
          value: 'mobile',
          type: 'text',
        },
        {
          text: this.$t('status'),
          sortable: false,
          value: 'options',
          type: 'arrayInBox',
          items: [
            {
              name: 'active',
              value: 1,
            },
            {
              name: 'deleted',
              value: 2,
            },
          ],
        },
        {
          text: this.$t('role'),
          sortable: false,
          value: 'role',
          type: 'equalBox',
          items: [
            {
              name: 'Super Admin',
              value: 'SA',
            },
            {
              name: 'Admin',
              value: 'AD',
            },
            {
              name: 'Viewer',
              value: 'VI',
            },
          ],
        },
        {
          text: this.$t('action'),
          value: 'actions',
          sortable: false,
          width: '12%',
          align: 'center',
        },
      ];
    },
  },
};
</script>
