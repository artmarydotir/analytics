<template>
  <v-row>
    <v-col cols="12">
      <v-select
        v-model="innerValue"
        :items="list"
        item-text="name"
        item-key="value"
        required
        outlined
        dense
        @input="onChange"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      innerValue: {
        name: this.$t('today'),
        value: 'to',
      },
      list: [
        {
          name: this.$t('today'),
          value: 'to',
        },
        {
          name: this.$t('yesterday'),
          value: 'ye',
        },
        {
          name: this.$t('last7days'),
          value: 'l7d',
        },
        {
          name: this.$t('last28days'),
          value: 'l28d',
        },
        {
          name: this.$t('last90days'),
          value: 'l90d',
        },
      ],
    };
  },

  methods: {
    onChange(v) {
      let t = null;

      if (v === 'to') {
        t = new Date();
        // today 00:00:00
        t = new Date(t).setHours(0, 0, 0, 0);
      } else if (v === 'ye') {
        t = new Date();
        // yesterday 00:00:00
        t = new Date(t.setDate(t.getDate() - 1)).setHours(0, 0, 0, 0);
      } else if (v === 'l7d') {
        t = new Date();
        // last 7 days 00:00:00
        t = new Date(t.setDate(t.getDate() - 7)).setHours(0, 0, 0, 0);
      } else if (v === 'l28d') {
        t = new Date();
        // last 28 days 00:00:00
        t = new Date(t.setDate(t.getDate() - 28)).setHours(0, 0, 0, 0);
      } else if (v === 'l90d') {
        t = new Date();
        // last 90 days 00:00:00
        t = new Date(t.setDate(t.getDate() - 90)).setHours(0, 0, 0, 0);
      }

      const manipulatedData = {
        type: v,
        range: [t, new Date().getTime()],
      };
      this.$emit('chartInfo', manipulatedData);
    },
  },
};
</script>
