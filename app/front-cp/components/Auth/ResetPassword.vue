<template>
  <div class="mx-auto text-center justify-center">
    <Snackbar />
    <ValidationObserver ref="obs">
      <v-card class="mx-auto" min-height="550px" elevation="7">
        <v-card-title class="pt-12 my-9 text-center justify-center text-h6">
          <p>
            {{ $t('enterRecoverCode') }}
          </p>
          <nuxt-link
            :to="localePath('forgot-password')"
            class="cyan--text text--darken-3 caption d-flex pb-4 pr-3 pl-3"
          >
            {{ $t('resend code?') }}
          </nuxt-link>
        </v-card-title>
        <v-card-text>
          <v-form
            novalidate="true"
            :disabled="isDisabled"
            @submit.prevent="handleSubmit"
          >
            <v-row justify="center" align="center">
              <v-col cols="12" md="10" lg="8" class="pb-0">
                <ValidationProvider
                  v-slot:default="{ errors }"
                  :name="$t('code')"
                  rules="required|min:6"
                >
                  <v-text-field
                    v-model.trim="user.token"
                    :error-messages="errors"
                    :label="$t('code')"
                    type="text"
                    outlined
                    dir="ltr"
                    required
                    prepend-inner-icon="mdi-lock-question"
                  />
                </ValidationProvider>
              </v-col>
              <v-col v-show="user.token" cols="12">
                <v-row justify="center">
                  <v-col cols="12" md="5" lg="4">
                    <ValidationProvider
                      v-slot:default="{ errors, valid }"
                      rules="required|min:7"
                      :name="$t('password')"
                      vid="passw"
                    >
                      <v-text-field
                        v-model="user.password"
                        :error-messages="errors"
                        :success="valid"
                        :label="$t('newPassword')"
                        :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye'"
                        :type="show ? 'text' : 'password'"
                        outlined
                        prepend-inner-icon="mdi-lock-outline"
                        @click:append="show = !show"
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="5" lg="4">
                    <ValidationProvider
                      v-slot:default="{ errors, valid }"
                      :name="$t('repeatPassword')"
                      rules="required|passwordcnf:@passw"
                    >
                      <v-text-field
                        v-model="confirmation"
                        :error-messages="errors"
                        :success="valid"
                        :label="$t('repeatPassword')"
                        :append-icon="show1 ? 'mdi-eye-off-outline' : 'mdi-eye'"
                        outlined
                        required
                        :type="show1 ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock-outline"
                        @click:append="show1 = !show1"
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-card-actions class="mt-10 mx-auto text-center justify-center">
              <v-btn
                type="submit"
                x-large
                :disabled="isDisabled"
                color="primary white--text"
                class="pl-12 pr-12"
              >
                {{ $t('changePassword') }}
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
  name: 'RecoverPassword',

  data() {
    return {
      isDisabled: false,
      confirmation: '',
      user: {
        token: '',
        password: '',
      },
      show: false,
      show1: false,
    };
  },
  created() {
    // later on email filler
  },
  methods: {
    async handleSubmit() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const [err, data] = await to(
        this.$store.dispatch('user/forgetPassword/resetPassword', this.user),
      );

      if (err) {
        console.log(err);
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
          this.isDisabled = false;
        }, 1800);
      }
      if (data) {
        this.isDisabled = true;
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
      }
    },
  },
};
</script>
