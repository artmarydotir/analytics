<template>
  <v-container class="pt-6" fluid>
    <DomainForm :title="$t('domainAdd')" :adding-confirmation="true" />
  </v-container>
</template>
<script>
export default {
  permissions: ['AD', 'SA'],
  data() {
    return {};
  },
  head() {
    return {
      title: this.$t('domainAdd'),
    };
  },
};
</script>
