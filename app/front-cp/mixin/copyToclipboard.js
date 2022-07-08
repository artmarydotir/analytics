export default {
  data() {
    return {
      copyContent: '',
    };
  },
  methods: {
    copyText(inputText) {
      navigator.clipboard.writeText(inputText || this.copyContent);
    },
  },
};
