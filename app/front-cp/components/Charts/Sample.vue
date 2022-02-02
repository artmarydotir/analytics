<template>
  <div id="echarts">
    <div id="myChart"></div>
    <div id="myChart2"></div>
  </div>
</template>
<script>
export default {
  name: 'Echart',
  data() {
    return {};
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : '';
    },
  },

  mounted() {
    this.echartsInit();
    // this.echartsInit2();
  },
  beforeDestroy() {
    this.$echarts.dispose(document.getElementById('myChart'));
  },
  methods: {
    echartsInit() {
      const myChart = this.$echarts.init(
        document.getElementById('myChart'),
        this.theme,
      );
      myChart.setOption({
        color: ['#FF0087'],
        title: { text: this.$t('login') },
        loading: true,
        inverse: true,
        tooltip: {
          formatter: '{c}',
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          inverse: true,
          data: [
            // 'a',
            // 'bb',
            // 'cccc',
            {
              value: 12,
              name: 'bb',
            },
            {
              value: 125,
              name: 'cc',
            },
            {
              value: 150,
              name: 'da',
            },
          ],
        },
        yAxis: { inverse: false },
        series: [
          {
            name: 'analytic',
            type: 'bar',
            data: [12, 28, 80],
            // inverse: true,
            label: {
              normal: {
                // eslint-disable-next-line object-shorthand
                formatter: function (params) {
                  console.log(params);
                  const v = new Intl.NumberFormat('fa-IR', {
                    style: 'currency',
                    currency: 'IRR',
                  }).format(params.value);
                  return `${JSON.parse('"\u200F"')}${v}`;
                },
                show: true,
                position: 'inside',
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
#myChart {
  height: 250px;
  width: 90%;
}
#myChart2 {
  width: 600px;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
  float: right;
}
</style>
