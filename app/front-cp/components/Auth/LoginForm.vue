<template>
  <ValidationObserver ref="obs">
    <v-row justify="center">
      <v-col cols="12">
        <v-card-title class="my-12 display-1 text-center justify-center">
          LOGIN
        </v-card-title>
        <v-form
          novalidate="true"
          :disabled="isDisabled"
          @submit.prevent="onSubmit"
        >
          <v-row align="center" justify="center">
            <v-col cols="12" md="9">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :name="$t('emailorusername')"
                rules="required|emailorusername"
              >
                <v-text-field
                  v-model.trim="authModel"
                  :label="$t('emailorusername')"
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
            <v-col cols="12" md="9">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :name="$t('emailorusername')"
                rules="required|emailorusername"
              >
                <v-text-field
                  v-model.trim="authModel"
                  :label="$t('emailorusername')"
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
            <v-col cols="12" md="9">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :name="$t('emailorusername')"
                rules="required|emailorusername"
              >
                <v-text-field
                  v-model.trim="authModel"
                  :label="$t('emailorusername')"
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
          </v-row>
          <v-card-actions class="mt-4 pb-10 mx-auto text-center justify-center">
            <v-btn type="submit" x-large color="primary" class="pl-12 pr-12">
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
  name: 'LoginForm',
  data() {
    return {
      isDisabled: false,
      authModel: '',
      user: {
        email: 'superadmin',
        username: '',
        password: '!c9pc$GHPPGpx8EC',
        otp: '',
      },
    };
  },
};
</script>
