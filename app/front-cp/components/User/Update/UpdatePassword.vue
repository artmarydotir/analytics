<template>
  <v-row class="pa-5">
    <Snackbar />
    <v-col cols="12">
      <ValidationObserver ref="obs">
        <v-form
          novalidate="true"
          :disabled="isDisabled"
          @submit.prevent="onSubmit"
        >
          <v-row>
            <v-col v-if="userStateRole !== 'SA'" cols="12" md="6" lg="4">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :name="$t('currentPassword')"
                rules="required"
              >
                <v-text-field
                  v-model.trim="user.currentPassword"
                  :error-messages="errors"
                  :success="valid"
                  :label="$t('currentPassword')"
                  :append-icon="show1 ? 'mdi-eye-off-outline' : 'mdi-eye'"
                  outlined
                  required
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                rules="required"
                :name="$t('newPassword')"
                vid="passw"
              >
                <v-text-field
                  v-model.trim="user.newPassword"
                  :error-messages="errors"
                  :success="valid"
                  :label="$t('newPassword')"
                  :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye'"
                  :type="show ? 'text' : 'password'"
                  outlined
                  required
                  @click:append="show = !show"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                :name="$t('repeatPassword')"
                rules="required|passwordcnf:@passw"
              >
                <v-text-field
                  v-model.trim="confermNewPassword"
                  :error-messages="errors"
                  :success="valid"
                  :label="$t('repeatPassword')"
                  :append-icon="show1 ? 'mdi-eye-off-outline' : 'mdi-eye'"
                  outlined
                  required
                  :type="show2 ? 'text' : 'password'"
                  @click:append="show2 = !show2"
                />
              </ValidationProvider>
            </v-col>
            <!-- actions -->
            <v-col
              cols="12"
              :class="
                $vuetify.breakpoint.smAndUp
                  ? 'd-flex justify-end align-end'
                  : ''
              "
            >
              <v-btn
                :disabled="isDisabled"
                type="submit"
                x-large
                color="primary white--text"
                class="mb-3 mr-1 ml-1 pl-12 pr-12"
              >
                Edit
              </v-btn>
              <v-btn
                x-large
                color="warning white--text"
                class="mb-3 mr-1 ml-1 pl-12 pr-12"
                @click="clear"
              >
                {{ $t('reset') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'EditPassword',
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      userStateRole: this.$store.getters['user/auth/GET_ROLE'],
      user: {
        currentPassword: '',
        newPassword: '',
      },
      confermNewPassword: '',
      isDisabled: false,
      show1: false,
      show: false,
      show2: false,
      loading3: false,
    };
  },
  methods: {
    clear() {
      this.user = {};
      this.$refs.obs.reset();
    },
    async onSubmit() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }
      this.user.id = this.userId;

      const [err, data] = await to(
        this.$store.dispatch('user/edit/updatePasswordUser', this.user),
      );
      if (err) {
        this.isDisabled = false;

        setTimeout(() => {
          this.user = {};
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 500);
      }
      if (data) {
        this.isDisabled = true;
        this.clear();
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
          this.user = {};
          if (this.loginRole.includes('SA')) {
            this.$router.push(
              this.localeRoute({
                name: 'user-list',
              }),
            );
          } else {
            this.$router.push(
              this.localeRoute({
                name: 'user-profile',
              }),
            );
          }
        }, 600);
      }
    },
  },
};
</script>
