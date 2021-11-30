<template>
  <v-row>
    <v-col cols="12" md="6">
      {{ value }}
      <v-checkbox
        v-model="options.ACTIVE"
        :label="$t('active')"
        :false-value="false"
        :true-value="true"
      ></v-checkbox>
    </v-col>
    <v-col cols="12" md="6">
      <v-checkbox
        v-model="options.DELETED"
        :label="$t('remove')"
        :false-value="false"
        :true-value="true"
      ></v-checkbox>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, Object],
      default: () => [],
      required: false,
    },
  },
  data() {
    return {
      options: {
        ACTIVE: false,
        DELETED: false,
      },
    };
  },
  watch: {
    value: {
      handler(v) {
        if (v.includes(1)) {
          this.options.ACTIVE = true;
        }
        if (v.includes(2)) {
          this.options.DELETED = true;
        }
      },
      immediate: true,
    },
    options: {
      handler(options) {
        console.log(options);
        this.$emit('sendOptions', options);
      },
      deep: true,
    },
  },
};
</script>
