<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- <v-system-bar height="30" color="primary darken-1"></v-system-bar> -->
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
