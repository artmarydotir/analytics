<template>
  <GeneralSelectBox
    :list="roleList"
    :value.sync="innerValue"
    :label="$t('chooseRole')"
  />
</template>

<script>
export default {
  props: {
    model: {
      type: String,
      required: false,
      default: undefined,
    },
  },

  data() {
    return {
      roleList: [
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
