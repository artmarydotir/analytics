<template>
  <div class="mx-auto text-center justify-center">
    <!-- <Snackbar /> -->
    <ValidationObserver ref="obs">
      <v-card class="mx-auto" min-height="550px" elevation="7">
        <v-card-title class="pt-12 my-9 text-center justify-center text-h6">
          <p>
            {{ $t('enterRecoverCode') }}
          </p>
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
                  v-slot:default="{ errors, valid }"
                  :name="$t('code')"
                  rules="numeric|digits:4"
                >
                  <v-text-field
                    v-model.trim="user.code"
                    :error-messages="errors"
                    :label="$t('code')"
                    type="text"
                    outlined
                    dir="ltr"
                    required
                    :disabled="codeDisabled"
                    prepend-inner-icon="mdi-lock-question"
                    @input="checkVerify(user.code, valid)"
                  />
                </ValidationProvider>
              </v-col>
              <v-col v-if="verified" cols="12">
                <v-row justify="center">
                  <v-col cols="12" md="5" lg="4">
                    <ValidationProvider
                      v-slot:default="{ errors, valid }"
                      rules="required|passmeter|min:8"
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
                        v-model="user.confirmation"
                        :error-messages="errors"
                        :success="valid"
                        :label="$t('repeatPassword')"
                        :append-icon="show1 ? 'mdi-eye-off-outline' : 'mdi-eye'"
                        outlined
                        required
                        :type="show1 ? 'text' : 'password'"
                        dark
                        prepend-inner-icon="mdi-lock-outline"
                        @click:append="show1 = !show1"
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-card-actions
              v-if="verified"
              class="mt-10 mx-auto text-center justify-center"
            >
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
      codeDisabled: false,
      userId: '',
      verified: false,
      user: {
        code: '',
        password: '',
        confirmation: '',
      },

      show: false,
      show1: false,
    };
  },
  created() {
    if (this.$route.params.id) {
      this.userId = this.$route.params.id;
    }
    this.userId = this.$store.state.user.forgetPassword.userForgotPassId;
  },
  methods: {
    async checkVerify(code, valid) {
      console.log(code, valid);
      if (!valid) {
        return;
      }
      if (Number(code) && code.length === 4 && valid) {
        this.codeDisabled = true;
        const [err, data] = await to(
          this.$store.dispatch('user/forgetPassword/verifyCode', {
            code: this.user.code,
            id: this.userId,
          }),
        );
        if (err) {
          setTimeout(() => {
            this.$store.commit('CLOSE_NOTIFICATION', false);
            this.codeDisabled = false;
            this.user.code = '';
          }, 2000);
          this.$nextTick(() => {
            this.$refs.obs.reset();
          });
        }
        if (data) {
          this.verified = true;
          this.codeDisabled = true;
          setTimeout(() => {
            this.$store.commit('CLOSE_NOTIFICATION', false);
          }, 500);
        }
      }
    },
    async handleSubmit() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const [err, data] = await to(
        this.$store.dispatch('user/forgetPassword/resetPassword', {
          rawPassword: this.user.password,
          id: this.userId,
        }),
      );

      if (err) {
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
          this.isDisabled = false;
          this.user.password = '';
          this.user.confirmation = '';
        }, 1800);
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
      }
      if (data) {
        console.log(data);
        this.isDisabled = true;
        setTimeout(() => {
          this.$router.push(this.path('/'));
        }, 2000);
      }
    },
  },
};
</script>
