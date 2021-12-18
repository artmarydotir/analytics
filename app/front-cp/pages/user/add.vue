<template>
  <v-container class="pt-6" fluid>
    <UserForm :title="$t('userAdd')" />
  </v-container>
</template>
<script>
export default {
  permissions: ['AD', 'SA'],
  head() {
    return {
      title: `${this.$t('userAdd')}`,
    };
  },
};
</script>
