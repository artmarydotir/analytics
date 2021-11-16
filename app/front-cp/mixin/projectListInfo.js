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
          width: '18%',
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
          width: '15%',
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
          width: '12%',
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
    headersViewer() {
      return [
        {
          text: this.$t('title'),
          sortable: false,
          value: 'title',
          type: 'text',
          width: '18%',
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
      ];
    },
  },
};
export default listInfo;
