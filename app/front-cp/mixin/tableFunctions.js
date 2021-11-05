const { to } = require('await-to-js');

const tableFunctions = {
  methods: {
    rowClick(item, row) {
      row.select(true);
    },
    // { limit, lastSeen, filter }
    async callTableListApi(inputConditions, moduleEndpoint) {
      this.loading = true;
      this.isDisabledMore = false;
      const [err, data] = await to(
        this.$store.dispatch(`${moduleEndpoint}`, inputConditions),
      );
      if (err) {
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 600);
      }
      if (data.docs.length < this.limit) {
        this.isDisabledMore = true;
      }

      if (data) {
        this.loading = false;
        return data.docs;
      }
    },
  },
};

export default tableFunctions;
