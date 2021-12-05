<template>
  <v-container fluid class="ma-0 pa-0">
    <IntroTemplate :title="$t('login')">
      <template v-slot:frame>
        <LoginForm />
      </template>
    </IntroTemplate>
  </v-container>
</template>

<script>
export default {
  layout: 'login',
  data() {
    return {
      tab: null,
      text: 'aaa',
    };
  },
  head() {
    return {
      title: this.$t('login'),
    };
  },
};
</script>
