<template>
  <div>
    <ValidationProvider
      v-slot:default="{ errors, valid }"
      :name="$t('mobileNumber')"
      :rules="{ required: requiredVal, mobileNumber: { code: countryCode } }"
    >
      <v-text-field
        v-model.trim="innerValue"
        :error-messages="errors"
        :success="valid"
        :label="$t('mobileNumber')"
        outlined
        required
        dir="ltr"
        type="tel"
      />
    </ValidationProvider>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: String,
      required: false,
      default: undefined,
    },
    countryCode: {
      type: String,
      required: true,
      default: 'IR',
    },
    requiredVal: {
      type: Boolean,
      default: false,
      required: false,
    },
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
