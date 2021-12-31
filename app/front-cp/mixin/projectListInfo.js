const listInfo = {
  computed: {
    headersAdmin() {
      return [
        {
          text: this.$t('id'),
          sortable: false,
          value: 'id',
          width: '5%',
        },
        {
          text: this.$t('title'),
          sortable: false,
          value: 'title',
          type: 'text',
          width: '17%',
        },
        {
          text: this.$t('users'),
          sortable: false,
          value: 'owner',
          width: '15%',
        },
        {
          text: this.$t('publicToken'),
          sortable: false,
          value: 'publicToken',
          width: '14%',
        },
        {
          text: this.$t('status'),
          sortable: false,
          value: 'options',
          type: 'arrayInBox',
          width: '12%',
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
          text: this.$t('createdAt'),
          sortable: false,
          value: 'createdAt',
          type: 'daterange',
          width: '19%',
        },
        {
          text: this.$t('action'),
          value: 'actions',
          sortable: false,
          width: '11%',
          align: 'center',
        },
      ];
    },
    headersClient() {
      return [
        {
          text: this.$t('title'),
          sortable: false,
          value: 'title',
          type: 'text',
          width: '16%',
        },
        {
          text: this.$t('description'),
          sortable: false,
          value: 'description',
          width: '15%',
        },
        {
          text: this.$t('publicToken'),
          sortable: false,
          value: 'publicToken',
          width: '15%',
        },
        {
          text: this.$t('members'),
          sortable: false,
          value: 'members',
          width: '15%',
        },
        {
          text: this.$t('action'),
          value: 'actions',
          sortable: false,
          width: '11%',
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
          text: this.$t('projectAdd'),
          to: '/project/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('projectList'),
          to: '/project/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
