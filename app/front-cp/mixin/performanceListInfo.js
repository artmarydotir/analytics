const listInfo = {
  computed: {
    headers() {
      return [
        {
          text: this.$t('id'),
          sortable: false,
          value: 'id',
          width: '5%',
        },
        {
          text: this.$t('name'),
          sortable: false,
          value: 'name',
          type: 'text',
          width: '15%',
        },
        {
          text: this.$t('url'),
          sortable: false,
          value: 'url',
          type: 'text',
          width: '15%',
        },
        {
          text: this.$t('interval'),
          sortable: false,
          value: 'interval',
          width: '10%',
        },
        {
          text: this.$t('status'),
          sortable: false,
          value: 'options',
          type: 'arrayInBox',
          width: '10%',
          items: [
            {
              name: this.$t('active'),
              value: 1,
            },
            {
              name: this.$t('deleted'),
              value: 2,
            },
          ],
        },
        {
          text: this.$t('createdAt'),
          sortable: false,
          value: 'createdAt',
          type: 'daterange',
          width: '20%',
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
          text: this.$t('performanceAdd'),
          to: '/performance/add',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('performanceList'),
          to: '/performance/list',
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
};
export default listInfo;
