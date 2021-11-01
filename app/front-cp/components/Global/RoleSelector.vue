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
          name: 'superAdmin',
          value: 'SA',
        },
        {
          name: 'admin',
          value: 'AD',
        },
        {
          name: 'viewer',
          value: 'VI',
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
