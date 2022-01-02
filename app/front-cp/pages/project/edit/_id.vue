<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />
    <template v-if="loading">
      <StaticBreadCrumb :crumbs="crumbs" />
      <ProjectForm
        :title="$t('projectEdit')"
        :edit-mood="true"
        :project="project"
        main-icon="file-edit"
      />
    </template>
    <template v-else>
      <v-skeleton-loader
        type="article, article ,card-heading,actions"
      ></v-skeleton-loader>

      <!-- {{ $t('notFound') }} -->
      <!-- <v-overlay :value="!loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay> -->
    </template>
  </v-container>
</template>

<script>
export default {
  permissions: ['AD', 'SA'],
  data() {
    return {
      project: {},
      loading: false,
      projectId: Number(this.$route.params.id),
    };
  },
  head() {
    return {
      title: this.$t('editProject'),
    };
  },
  computed: {
    crumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/dashboard',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('projectList'),
          to: '/project/list',
          refresh: false,
          disabled: false,
        },
        {
          text: this.$t('projectEdit'),
          to: `/project/edit/${this.projectId}`,
          refresh: true,
          disabled: false,
        },
      ];
    },
  },
  async mounted() {
    this.loading = false;
    if (this.projectId) {
      const result = await this.$store.dispatch('project/showProjectProfile', {
        projectId: this.projectId,
        fields: [
          'id',
          'title',
          'description',
          'options',
          'userAndRules',
          'publicToken',
          'primaryOwner',
        ],
      });
      if (result) {
        this.loading = true;
        this.project = { ...result };
      }
    }
  },
};
</script>
