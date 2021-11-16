<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />
    <template v-if="project">
      <ProjectForm
        :title="$t('projectEdit')"
        :edit-mood="true"
        :project="project"
      />
    </template>
    <template v-else>
      {{ $t('projectNotFound') }}
    </template>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      project: {},
      projectId: Number(this.$route.params.id),
    };
  },
  head() {
    return {
      title: this.$t('editProject'),
    };
  },
  async mounted() {
    if (this.projectId) {
      const result = await this.$store.dispatch(
        'project/showProjectProfile',
        this.projectId,
      );
      this.project = { ...result };
    }
  },
};
</script>
