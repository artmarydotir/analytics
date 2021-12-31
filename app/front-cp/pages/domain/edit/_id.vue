<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />

    <template v-if="loading">
      <DomainForm
        :title="$t('domainEdit')"
        :edit-mood="true"
        :domain="domain"
        main-icon="folder-edit"
      />
    </template>
    <template v-else>
      {{ $t('noResult') }}
    </template>
  </v-container>
</template>

<script>
export default {
  permissions: ['AD', 'SA'],
  data() {
    return {
      domain: {},
      loading: false,
      domainId: Number(this.$route.params.id),
    };
  },
  head() {
    return {
      title: this.$t('domainEdit'),
    };
  },
  async mounted() {
    this.loading = false;
    if (this.domainId) {
      const result = await this.$store.dispatch(
        'domain/showDomainProfile',
        this.domainId,
      );
      if (result) {
        this.loading = true;
      }
      this.domain = { ...result };
    }
  },
};
</script>
