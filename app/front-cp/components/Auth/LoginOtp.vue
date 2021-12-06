<template>
  <ValidationObserver ref="obs">
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-form
          novalidate="true"
          :disabled="isDisabled"
          @submit.prevent="onSubmit"
        >
          <v-row align="center" justify="center" class="pt-6">
            <v-col cols="12" md="9" lg="7" class="pb-0">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :name="$t('email')"
                rules="required|email"
              >
                <v-text-field
                  v-model.trim="user.email"
                  :label="$t('email')"
                  type="text"
                  outlined
                  required
                  dir="ltr"
                  :error-messages="errors"
                  :success="valid"
                  prepend-inner-icon="mdi-email-outline"
                />
              </ValidationProvider>
            </v-col>

            <v-col cols="12" md="9" lg="7" class="pb-0">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :rules="{
                  required: true,
                  min: 6,
                }"
                :name="$t('otpCode')"
              >
                <v-text-field
                  v-model="user.otp"
                  :error-messages="errors"
                  :success="valid"
                  :label="$t('otpCode')"
                  type="text"
                  dir="ltr"
                  outlined
                  prepend-inner-icon="mdi-lock-reset"
                  @click:append="show = !show"
                />
              </ValidationProvider>
            </v-col>
          </v-row>
          <v-card-actions class="mt-4 pb-10 mx-auto text-center justify-center">
            <v-btn dark type="submit" x-large color="cyan" class="pl-12 pr-12">
              {{ $t('login') }}
              <v-icon right class="pt-1" small dark>
                mdi-arrow-{{ arrow }}
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </ValidationObserver>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'LoginOtp',
  data() {
    return {
      text: 'aaa',
      isDisabled: false,
      show: false,
      type: 'AO',
      user: {
        email: '',
        otp: '',
      },
    };
  },
  computed: {
    arrow() {
      return this.$vuetify.rtl ? 'left' : 'right';
    },
  },
  methods: {
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
      this.user.otp = '';
      this.user.email = '';
    },
  },
};
</script>
