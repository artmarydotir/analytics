<template>
  <v-container class="pt-6" fluid>
    <UptimeForm :title="$t('uptimeAdd')" />
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
      title: this.$t('uptimeAdd'),
    };
  },
};
</script>
