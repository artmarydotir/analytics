<template>
  <div>
    <Snackbar />
    <v-tabs
      v-model="tab"
      fixed-tabs
      slider-color="yellow darken-1"
      background-color="cyan darken-1"
      dark
      slider-size="4"
    >
      <v-tab href="#tab-1" class="white--text">
        <v-icon left>mdi-shield-key-outline</v-icon>
        {{ $t('password') }}
      </v-tab>

      <v-tab href="#tab-2" class="white--text">
        <v-icon left>mdi-lock-outline</v-icon>
        {{ $t('otp') }}
      </v-tab>
    </v-tabs>
    <v-card elevation="7">
      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <v-card flat>
            <v-card-text>
              <LoginPassword />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-2">
          <v-card flat>
            <v-card-text>
              <LoginOtp />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      tab: null,
    };
  },
  // mounted() {
  //   if (this.$store.state.user.auth.isLogin) {
  //     this.$router.push(
  //       this.localeRoute({
  //         name: 'dashboard',
  //       }),
  //     );
  //   }
  // },
};
</script>
