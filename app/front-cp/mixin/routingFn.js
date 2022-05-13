const routingFn = {
  methods: {
    errorCallback() {
      this.isDisabled = false;
      setTimeout(() => {
        this.$store.commit('CLOSE_NOTIFICATION', false);
      }, 6000);
    },

    redirecting(namedRoute) {
      this.isDisabled = true;
      setTimeout(() => {
        this.$router.push(
          this.localeRoute({
            name: namedRoute,
          }),
        );
      }, 1100);
    },
  },
};
export default routingFn;
