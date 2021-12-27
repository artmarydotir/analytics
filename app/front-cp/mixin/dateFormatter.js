const dateFormatter = {
  data() {
    return {
      currentLocale: this.$i18n.locale ? this.$i18n.locale : 'en-US',
    };
  },
  methods: {
    formatDateTime({
      value,
      options = {
        dateStyle: 'long',
        timeStyle: 'short',
      },
    }) {
      return new Intl.DateTimeFormat(this.currentLocale, options).format(
        new Date(value),
      );
    },
  },
};
export default dateFormatter;
