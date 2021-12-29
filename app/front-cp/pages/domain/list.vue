<template>
  <v-container class="pt-6" fluid>
    <DomainList
      :headers="headersAdmin"
      :general-action="adminGeneralAction"
      :module-info="adminModuleData"
      main-icon="domain"
    />
  </v-container>
</template>

<script>
import listInfo from '@/mixin/domainListInfo';

export default {
  permissions: ['AD', 'SA'],
  mixins: [listInfo],
  data() {
    return {
      userRole: this.$store.getters['user/auth/GET_ROLE'],
      adminModuleData: {
        url: 'domain/list/adminListDomain',
        rmUrl: 'domain/deleteDomain',
        name: 'domainEntity',
      },
      adminGeneralAction: {
        title: 'domainList',
        addLink: 'domain-add',
        editLink: '/domain/edit',
        linkTitle: 'domainAdd',
        deletable: true,
        editable: true,
      },
    };
  },
  head() {
    return {
      title: this.$t('domainList'),
    };
  },
};
</script>
