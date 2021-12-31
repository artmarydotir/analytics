<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <PerformanceList
      :headers="headers"
      :general-action="generalAction"
      :module-info="moduleData"
      main-icon="chart-areaspline"
    >
    </PerformanceList>
  </v-container>
</template>
<script>
import listInfo from '@/mixin/performanceListInfo';

export default {
  permissions: ['AD', 'SA', 'CL'],
  mixins: [listInfo],

  data() {
    return {
      userRole: this.$store.getters['user/auth/GET_ROLE'],
      moduleData: {
        url: 'performance/list/performanceList',
        rmUrl: 'performance/deletePerformance',
        name: 'performanceEntity',
      },
      generalAction: {
        title: 'performanceList',
        addLink: 'performance-add',
        editLink: '/performance/edit',
        linkTitle: 'performanceAdd',
        deletable: true,
        editable: true,
      },
    };
  },
  head() {
    return {
      title: this.$t('performanceList'),
    };
  },
};
</script>
