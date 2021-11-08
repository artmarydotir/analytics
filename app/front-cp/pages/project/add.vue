<template>
  <v-container class="pt-6" fluid>
    <ProjectForm :title="$t('projectAdd')" :project="project" />
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      project: {},
    };
  },
  head() {
    return {
      title: this.$t('projectAdd'),
    };
  },
};
</script>
