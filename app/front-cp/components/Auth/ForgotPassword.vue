<template>
  <div class="mx-auto text-center justify-center">
    <Snackbar />
    <ValidationObserver ref="obs">
      <v-card flat class="mx-auto" min-height="500px" elevation="7">
        <v-card-title class="pt-12 my-9 text-center justify-center text-h6">
          <p>Enter your email in order to send you a code.</p>
        </v-card-title>
        <v-card-text>
          <v-form
            novalidate="true"
            :disabled="isDisabled"
            class="pt-8"
            @submit.prevent="onSubmit"
          >
            <v-row justify="center" align="center">
              <v-col cols="12" md="9" lg="8" class="mb-0 pb-0">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :name="$t('email')"
                  rules="required|email"
                >
                  <v-text-field
                    v-model.trim="user.email"
                    :error-messages="errors"
                    :success="valid"
                    :label="$t('email')"
                    type="email"
                    dir="ltr"
                    outlined
                    required
                    prepend-inner-icon="mdi-email-outline"
                  />
                </ValidationProvider>
              </v-col>
            </v-row>

            <v-card-actions class="mt-6 mx-auto text-center justify-center">
              <v-btn
                type="submit"
                x-large
                color="primary white--text"
                class="pl-12 pr-12"
              >
                {{ $t('sendMeCode') }}
              </v-btn>
              <v-btn
                type="submit"
                x-large
                color="warning white--text"
                class="pl-12 pr-12"
                :to="localePath('/')"
              >
                {{ $t('back') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </ValidationObserver>
  </div>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'ForgotPassword',
  data() {
    return {
      isDisabled: false,
      user: {
        email: '',
      },
    };
  },
  methods: {
    async onSubmit() {
      console.log('---heyy');
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }
      const [err, data] = await to(
        this.$store.dispatch('user/forgetPassword/verifyUser', this.user),
      );

      if (err) {
        this.isDisabled = false;

        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 2000);
      }
      if (data) {
        this.isDisabled = true;
        this.$router.push(
          this.localeRoute({
            name: 'recover_password',
            // params: {
            //   id: this.$store.state.user.forgetPassword.userForgotPassId,
            // },
          }),
        );
      }
    },
  },
};
</script>
