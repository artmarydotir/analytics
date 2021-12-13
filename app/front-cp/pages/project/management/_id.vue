<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />
    {{ $route.params.id }}
    <template v-if="loading">
      <ProjectUserManagement />
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
      loading: false,
      projectId: Number(this.$route.params.id),
    };
  },
  head() {
    return {
      title: this.$t('manageProject'),
    };
  },
  // eslint-disable-next-line require-await
  async mounted() {
    this.loading = false;
    if (this.projectId) {
      const result = await this.$store.dispatch('project/showProjectProfile', {
        projectId: this.projectId,
        fields: ['id', 'title', 'userAndRules'],
      });
      if (result) {
        this.loading = true;
        this.project = { ...result };
      }
    }
  },
};
</script>
