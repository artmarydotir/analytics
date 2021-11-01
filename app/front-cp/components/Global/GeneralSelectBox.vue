<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :name="name"
    :rules="{ required: requiredVal }"
  >
    <v-select
      v-model="innerValue"
      :items="list"
      :error-messages="errors"
      :success="valid"
      item-text="name"
      item-key="value"
      :label="label"
      required
      outlined
    ></v-select>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'GeneralSelectBox',
  props: {
    value: {
      type: String,
      default: '',
      required: false,
    },
    name: {
      type: String,
      default: '',
      required: false,
    },
    label: {
      type: String,
      default: '',
      required: false,
    },
    requiredVal: {
      type: Boolean,
      default: true,
      required: false,
    },
    list: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  computed: {
    innerValue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('update:value', v);
      },
    },
  },
};
</script>
