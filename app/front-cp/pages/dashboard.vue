<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6"> {{ $t('copyright') }} </v-col>
      <v-col cols="12">
        sss
        <Sample />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  permissions: ['AD', 'SA', 'CL'],
  head() {
    return {
      title: this.$t('dashboard'),
    };
  },
};
</script>
