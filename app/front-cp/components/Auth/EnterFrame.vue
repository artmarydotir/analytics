<template>
  <div class="mx-auto text-center justify-center">
    <ValidationObserver ref="obs">
      <v-card flat class="mx-auto rounded-xl" max-width="900">
        <v-card-text>
          <v-row justify="center" align="center">
            <v-col cols="12">
              <LoginForm />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </ValidationObserver>
    <div class="mt-5 text-center caption">
      <nuxt-link
        :to="localePath('forgot_password')"
        class="light-blue--text text--lighten-5"
      >
        {{ $t('forgotPassword') }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnterFrame',
  props: {
    image: {
      type: String,
      required: true,
    },
  },
};
</script>
