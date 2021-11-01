<template>
  <GeneralSelectBox
    :list="langList"
    :value.sync="innerValue"
    :label="$t('chooseLang')"
  />
</template>

<script>
export default {
  name: 'LanguageSelector',
  props: {
    model: {
      type: String,
      required: false,
      default: undefined,
    },
  },

  data() {
    return {
      langList: [
        {
          name: 'فارسی',
          value: 'fa',
        },
        {
          name: 'English',
          value: 'en',
        },
        {
          name: 'العربی',
          value: 'ar',
        },
      ],
    };
  },
  computed: {
    innerValue: {
      get() {
        return this.model;
      },
      set(v) {
        this.$emit('update:model', v);
      },
    },
  },
};
</script>
