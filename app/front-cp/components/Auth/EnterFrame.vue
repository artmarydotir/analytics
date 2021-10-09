<template>
  <div class="mx-auto text-center justify-center">
    <ValidationObserver ref="obs">
      <v-card flat class="mx-auto rounded-xl" max-width="1100">
        <v-card-text>
          <v-row justify="center" align="center">
            <v-col cols="12" md="7" lg="7">
              <LoginForm />
            </v-col>
            <v-col cols="12" md="4" lg="4" align-self="end">
              <div class="d-none d-xs-none d-sm-none d-md-flex">
                <v-subheader
                  class="mx-auto text-center mt-10 text-center justify-center"
                >
                  <h4>Welcome to analytics panel</h4>
                </v-subheader>
              </div>
              <v-img
                :width="$vuetify.breakpoint.mdAndDown ? '200' : '100%'"
                class="mt-5 mx-auto text-center"
                :src="require(`../../assets/images/${image}`)"
              ></v-img>
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
