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
          text: this.$t('ping'),
          sortable: false,
          value: 'ping',
          width: '10%',
        },
        {
          text: this.$t('status'),
          sortable: false,
          value: 'options',
          type: 'arrayInBox',
          width: '12%',
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
  },
};
export default listInfo;
