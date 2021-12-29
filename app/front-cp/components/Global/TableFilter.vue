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
        $vuetify.breakpoint.smAndDown
          ? 'd-inline pt-1 no-border-bottom'
          : $vuetify.breakpoint.mdAndUp
          ? 'd-block d-md-table-cell pt-2 pb-2'
          : 'd-block d-md-table-cell pt-3 pb-3'
      "
    >
      <template v-if="f.type == 'text'">
        <v-text-field
          v-model.trim="filter[`like_${f.value}`]"
          hide-details
          dense
          type="text"
          clearable
          outlined
          :label="$t(f.value)"
          @input="sendFilter"
        ></v-text-field>
      </template>
      <template v-if="f.type == 'arrayInBox'">
        <v-select
          v-model.trim="filter[`arrIn_${f.value}`]"
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
      <template v-if="f.type == 'daterange'">
        <RangeDateTimePicker
          :dense="true"
          :hidedetail="true"
          :lang="currentLang"
          :from-date.sync="fromDate"
          :to-date.sync="toDate"
          placeholder="Select datetime"
        />
      </template>
    </td>
  </tr>
</template>

<script>
import debounce from 'lodash/debounce';
import 'aasaam-vuetify-datetime';

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
      fromDate: undefined,
      toDate: undefined,
    };
  },
  computed: {
    currentLang() {
      return this.$i18n.locale;
    },
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
    fromDate(val) {
      const d = new Date();
      if (val === undefined) {
        this.$set(this.filter, 'dts_createdAt', d);
        this.$emit('sendReadyFilter', this.filter);
      }
      this.$set(this.filter, 'dts_createdAt', val);
      this.$emit('sendReadyFilter', this.filter);
    },

    toDate(val) {
      this.$set(this.filter, 'dte_createdAt', val);
      this.$emit('sendReadyFilter', this.filter);
    },
  },
  methods: {
    sendFilter: debounce(function () {
      this.$emit('sendReadyFilter', this.filter);
    }, 900),
  },
};
</script>

<style lang="scss" scoped>
.no-border-bottom {
  border-bottom: none;
}
</style>
