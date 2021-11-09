<template>
  <ValidationObserver ref="obs">
    <v-row justify="center" align="center">
      <v-col cols="12" class="pt-8">
        <v-form
          novalidate="true"
          :disabled="isDisabled"
          @submit.prevent="onSubmit"
        >
          <v-row align="center" justify="center" class="pt-6">
            <v-col cols="12" md="9" lg="8" class="pb-0">
              <ValidationProvider
                v-slot:default="{ errors }"
                :name="$t('email')"
                rules="required|email"
              >
                <v-text-field
                  v-model.trim="user.email"
                  :label="$t('email')"
                  type="text"
                  outlined
                  required
                  :error-messages="errors"
                  prepend-inner-icon="mdi-email-outline"
                />
              </ValidationProvider>
            </v-col>

            <v-col cols="12" md="9" lg="8" class="pb-0">
              <ValidationProvider
                v-slot:default="{ errors }"
                :rules="{
                  required: true,
                  min: 8,
                  regex:
                    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{7,})/,
                }"
                :name="$t('password')"
              >
                <v-text-field
                  v-model="user.password"
                  :error-messages="errors"
                  :label="$t('password')"
                  :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye'"
                  :type="show ? 'text' : 'password'"
                  outlined
                  prepend-inner-icon="mdi-lock-outline"
                  @click:append="show = !show"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="12" md="9" lg="8" class="pb-0">
              <Captcha @solvedCapatcha="getcaptchaValue" />
            </v-col>
          </v-row>
          <v-card-actions class="mt-4 pb-10 mx-auto text-center justify-center">
            <v-btn dark type="submit" x-large color="cyan" class="pl-12 pr-12">
              {{ $t('login') }}
              <v-icon right dark> mdi-arrow-right </v-icon>
            </v-btn>
          </v-card-actions>
          <v-divider></v-divider>
          <div class="mt-5 text-center caption">
            <nuxt-link
              :to="localePath('forgot-password')"
              class="cyan--text text--darken-3"
            >
              {{ $t('forgotPassword') }}
            </nuxt-link>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </ValidationObserver>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'LoginPassword',
  data() {
    return {
      isDisabled: false,
      show: false,
      type: 'AP',
      user: {
        email: 'adminer@gmail.com',
        password: 'e0W!^~x1pHw%$V&h',
        captcha: null,
      },
    };
  },
  methods: {
    getcaptchaValue(v) {
      this.user.captcha = v;
    },
    async onSubmit() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const [err, data] = await to(
        this.$store.dispatch('user/auth/signIn', {
          type: this.type,
          data: this.user,
        }),
      );

      if (err) {
        this.isDisabled = false;
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 2000);
      }

      if (data) {
        this.isDisabled = true;

        setTimeout(() => {
          this.$router.push(
            this.localeRoute({
              name: 'dashboard',
            }),
          );
        }, 1500);

        this.$nextTick(() => {
          this.clearForm();
          this.$refs.obs.reset();
        });
      }
    },
    clearForm() {
      this.user.captcha = null;
      this.user.email = '';
      this.user.password = '';
    },
  },
};
</script>
