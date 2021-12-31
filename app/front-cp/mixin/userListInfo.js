const listInfo = {
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
              name: this.$t('superAdmin'),
              value: 'SA',
            },
            {
              name: this.$t('admin'),
              value: 'AD',
            },
            {
              name: this.$t('client'),
              value: 'CL',
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
    // Breadcrumb
    crumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/dashboard',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('userAdd'),
          to: '/user/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('userList'),
          to: '/user/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
