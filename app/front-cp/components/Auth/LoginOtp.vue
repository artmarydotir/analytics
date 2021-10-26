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
                  :error-messages="errors"
                  :success="valid"
                  prepend-inner-icon="mdi-email-outline"
                  @input="checkAuthModel"
                />
              </ValidationProvider>
            </v-col>

            <v-col cols="12" md="9" lg="7" class="pb-0">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :rules="{
                  required: true,
                  min: 8,
                }"
                :name="$t('password')"
              >
                <v-text-field
                  v-model="user.password"
                  :error-messages="errors"
                  :success="valid"
                  :label="$t('otpCode')"
                  :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye'"
                  :type="show ? 'text' : 'password'"
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
              <v-icon right dark> mdi-arrow-right </v-icon>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </ValidationObserver>
</template>

<script>
export default {
  name: 'LoginOtp',
  data() {
    return {
      tab: null,
      text: 'aaa',
      isDisabled: false,
      authModel: '',
      show: false,
      user: {
        type: 'AO',
        email: '',
        password: '',
      },
    };
  },
};
</script>
