<template>
  <ValidationProvider v-slot:default="{ errors, valid }" name="country">
    <v-autocomplete
      v-model="innercountry"
      :items="items"
      outlined
      :error-messages="errors"
      :success="valid"
      item-text="nativeName"
      item-value="alpha2Code"
      autocomplete
      prepend-inner-icon="mdi-earth-plus"
      :label="$t('selectCountry')"
    >
      <template slot="item" slot-scope="{ item }">
        <span class="pr-2">{{ item.emoji }}</span>
        {{ item.nativeName }} ({{ item.name }})
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>
<script>
import country from '@/utils/country';

export default {
  name: 'CountrySelect',

  props: {
    model: {
      type: String,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      items: country,
    };
  },

  computed: {
    innercountry: {
      get() {
        return this.model;
      },
      set(newValue) {
        this.$emit('update:model', newValue);
      },
    },
  },
};
</script>
