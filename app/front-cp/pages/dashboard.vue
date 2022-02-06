<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-subheader> Analytics Home </v-subheader>
          </v-col>
          <v-col cols="12" md="8">
            <Hchart1 />
            <!-- <InitChart :option="barOption" /> -->
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  permissions: ['AD', 'SA', 'CL'],
  data() {
    return {
      tabTitle: ['users', 'clients', 'projects'],
      barOption: {
        title: {
          text: 'Sessions by country',
          left: 'center',
        },

        xAxis: {
          type: 'category',
          data: ['ایران', 'آلمان', 'سلام علیکم', 'Afghanistan'],
        },
        yAxis: {
          type: 'value',
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar', data: [10, 52, 200, 334] }],
      },
    };
  },
  head() {
    return {
      title: this.$t('dashboard'),
    };
  },
};
</script>
