<template>
  <v-container fluid class="ma-0 pa-0">
    <IntroTemplate title="Reset Password">
      <template v-slot:frame>
        <ResetPassword />
      </template>
    </IntroTemplate>
  </v-container>
</template>

<script>
export default {
  layout: 'login',

  head() {
    return {
      title: this.$t('reset_password'),
    };
  },
};
</script>
