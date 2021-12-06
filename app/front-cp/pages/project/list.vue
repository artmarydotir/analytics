<template>
  <v-container class="pt-6" fluid>
    <template v-if="userRole === 'VI'">
      <ProjectOwnerList
        :headers="headersClient"
        :general-action="ownerGeneralAction"
        :module-info="ownerModuleData"
      />
    </template>
    <!-- Admin  -->
    <template v-else>
      <ProjectList
        :headers="headersAdmin"
        :general-action="adminGeneralAction"
        :module-info="adminModuleData"
      >
      </ProjectList>
    </template>
  </v-container>
</template>
<script>
import listInfo from '@/mixin/projectListInfo';

export default {
  mixins: [listInfo],

  data() {
    return {
      userRole: this.$store.getters['user/auth/GET_ROLE'],
      adminModuleData: {
        url: 'project/list/adminListProject',
        rmUrl: 'project/deleteProject',
        name: 'projectEntity',
      },
      adminGeneralAction: {
        title: 'projectList',
        addLink: 'project-add',
        editLink: '/project/edit',
        linkTitle: 'projectAdd',
        deletable: true,
        editable: true,
      },
      ownerModuleData: {
        url: 'project/list/clientListProject',
        name: 'projectEntity',
      },
      ownerGeneralAction: {
        title: 'myProjectList',
      },
    };
  },
  head() {
    return {
      title: this.$t('projectList'),
    };
  },
};
</script>
