<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <p class="white--text display-2 text-center justify-center pb-2">
          Analytics
        </p>
      </v-col>
      <v-col cols="12" sm="12" md="10" lg="8">
        <!-- <Login /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'login',
  permissions: ['SA', 'AD', 'VI'],
  head() {
    return {
      title: this.$t('login'),
    };
  },
};
</script>
