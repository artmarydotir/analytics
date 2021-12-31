<template>
  <v-container class="pt-6" fluid>
    <StaticBreadCrumb :crumbs="crumbs" />
    <UptimeList
      :headers="headers"
      :general-action="generalAction"
      :module-info="moduleData"
      main-icon="monitor-eye"
    >
    </UptimeList>
  </v-container>
</template>
<script>
import listInfo from '@/mixin/uptimeListInfo';

export default {
  permissions: ['AD', 'SA', 'CL'],
  mixins: [listInfo],

  data() {
    return {
      userRole: this.$store.getters['user/auth/GET_ROLE'],
      moduleData: {
        url: 'uptime/list/uptimeList',
        rmUrl: 'uptime/deleteUptime',
        name: 'uptimeEntity',
      },
      generalAction: {
        title: 'uptimeList',
        addLink: 'uptime-add',
        editLink: '/uptime/edit',
        linkTitle: 'uptimeAdd',
        deletable: true,
        editable: true,
      },
    };
  },
  head() {
    return {
      title: this.$t('uptimeList'),
    };
  },
};
</script>
