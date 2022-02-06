<template>
  <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
    <v-card-text class="font-weight-bold">
      <v-tabs
        v-model="tab"
        background-color="transparent"
        centered
        dark
        :grow="$vuetify.breakpoint.smAndDown ? true : false"
        :fixed-tabs="$vuetify.breakpoint.mdAndUp ? true : false"
        show-arrows
        align-with-title
        height="50"
      >
        <v-tabs-slider color="amber"></v-tabs-slider>

        <v-tab
          v-for="(name, i) in tabTitle"
          :key="name"
          :href="'#tab-' + i"
          class="primary--text"
          active-class="primary--text"
        >
          {{ $t(name) }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-0">
          <MainHistogram :value.sync="chartData" />
        </v-tab-item>
        <v-tab-item value="tab-1">2 </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-divider></v-divider>

    <v-card-actions>
      <v-row>
        <v-col cols="8" md="4" class="pr-4 pl-4">
          <TimeRangeSelector @chartInfo="getFilterData" />
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4" md="4" class="d-flex justify-end">
          <v-btn color="primary" text class="caption">
            {{ $t('audienceOverview') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Hchart1',

  data() {
    return {
      chartData: {
        type: 'to',
        range: [new Date().setHours(0, 0, 0, 0), new Date().getTime()],
      },
      convertedFilter: '',
      tab: null,
      tabTitle: [
        'users',
        'session',
        'bounceRate',
        'pageViews',
        'sessionDuration',
        'returnUsers',
      ],
    };
  },
  computed: {},
  methods: {
    getFilterData(v) {
      this.chartData = v;
    },
  },
};
</script>
