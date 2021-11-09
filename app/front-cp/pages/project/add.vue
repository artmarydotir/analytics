<template>
  <v-container class="pt-6" fluid>
    <ProjectForm :title="$t('projectAdd')" />
  </v-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  head() {
    return {
      title: this.$t('projectAdd'),
    };
  },
};
</script>
