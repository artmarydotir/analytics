<template>
  <v-chart
    ref="chart"
    class="chart"
    :init-options="initOptions"
    :option="option"
    :loading="false"
    :autoresize="true"
  />
</template>

<script>
import { use } from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GridSimpleComponent,
  DataZoomComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

use([
  SVGRenderer,
  GridComponent,
  GridSimpleComponent,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
]);

export default {
  name: 'Echart',
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: {
      // backgroundColor: '#fff',
      // color: '#333',
      textStyle: {
        fontFamily: 'aasaam-Noto',
      },
    },
  },
  props: {
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  // add defult option in chart render
  data() {
    return {
      initOptions: {
        renderer: 'svg',
        // theme: this.$vuetify.theme.dark ? 'dark' : 'light',
      },
    };
  },
  beforeDestroy() {
    console.log('beforeDestroy');
    this.$refs.chart.dispose();
  },
};
</script>
<style scoped>
.chart {
  height: 50vh;
}
</style>
