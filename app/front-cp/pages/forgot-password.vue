<template>
  <v-container fluid class="ma-0 pa-0">
    <IntroTemplate title="Forgot Password">
      <template v-slot:frame>
        <ForgotPassword />
      </template>
    </IntroTemplate>
  </v-container>
</template>

<script>
export default {
  layout: 'login',

  head() {
    return {
      title: this.$t('forgot_password'),
    };
  },
};
</script>
