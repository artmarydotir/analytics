<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />
    <UserUpdateWrapper
      :id="userId"
      :title="$t('editUser')"
      :submit-title="$t('edit')"
    />
  </v-container>
</template>

<script>
export default {
  permissions: ['AD', 'SA', 'CL'],
  data() {
    return {
      userId: Number(this.$route.params.id),
    };
  },
  head() {
    return {
      title: this.$t('editUser'),
    };
  },
};
</script>
