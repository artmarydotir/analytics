<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6"> welcome </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t('dashboard'),
    };
  },
};
</script>
