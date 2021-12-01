<template>
  <tr
    :class="
      $vuetify.theme.dark
        ? 'grey darken-4 font-weight-light rounded pa-4 white--text'
        : 'white font-weight-light rounded pa-4 white--text'
    "
  >
    <td
      v-for="f in filtertype"
      :key="f.name"
      :class="
        $vuetify.breakpoint.mdAndDown
          ? 'd-block d-md-table-cell pt-1'
          : 'd-block d-md-table-cell pt-3 pb-3'
      "
    >
      <template v-if="f.type == 'text'">
        <v-text-field
          v-model="filter[`like_${f.value}`]"
          hide-details
          dense
          type="text"
          clearable
          outlined
          :label="$t(f.value)"
          @input="sendFilter"
        ></v-text-field>
      </template>
      <!-- @TODO: multiple selectbox -->
      <template v-if="f.type == 'arrayInBox'">
        <v-select
          v-model="filter[`arrIn_${f.value}`]"
          hide-details
          outlined
          clearable
          :items="f.items"
          :label="$t(f.value)"
          multiple
          dense
          item-text="name"
          item-value="value"
          @input="sendFilter"
        ></v-select>
      </template>
      <template v-if="f.type == 'equalBox'">
        <v-select
          v-model="filter[`eq_${f.value}`]"
          hide-details
          outlined
          clearable
          :items="f.items"
          :label="$t(f.value)"
          dense
          item-text="name"
          item-value="value"
          @input="sendFilter"
        ></v-select>
      </template>
    </td>
  </tr>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'TableFilter',
  props: {
    filtertype: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      filter: {},
    };
  },
  watch: {
    filter: {
      handler(val) {
        let whoRemove = '';
        for (const [key, value] of Object.entries(val)) {
          whoRemove = key;
          if (value == null) {
            this.$delete(this.filter, whoRemove);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    sendFilter: debounce(function () {
      this.$emit('sendReadyFilter', this.filter);
    }, 900),
  },
};
</script>
