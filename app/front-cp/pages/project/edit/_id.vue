<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />
    <template v-if="loading">
      <ProjectForm
        :title="$t('projectEdit')"
        :edit-mood="true"
        :project="project"
        main-icon="file-edit"
      />
    </template>
    <template v-else>
      {{ $t('projectNotFound') }}
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
