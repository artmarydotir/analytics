<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="secondary white--text pa-4">
        {{ title }}
        <v-spacer></v-spacer>
      </v-card-title>
      <!-- Form -->
      <div class="pa-6">
        <ValidationObserver ref="obs">
          <v-form
            novalidate="true"
            :disabled="isDisabled"
            @submit.prevent="onSubmit"
          >
            <v-row>
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  rules="required|alpha_dash"
                  :name="$t('username')"
                >
                  <v-text-field
                    v-model.trim="user.username"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('username')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  rules="required|email"
                  :name="$t('email')"
                >
                  <v-text-field
                    v-model.trim="user.email"
                    :error-messages="errors"
                    :success="valid"
                    dir="ltr"
                    type="text"
                    outlined
                    required
                    :label="$t('email')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <RoleSelector :model.sync="user.role" />
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{
                    required: true,
                    min: 8,
                  }"
                  :name="$t('password')"
                  vid="passw"
                >
                  <v-text-field
                    v-model="user.password"
                    :error-messages="errors"
                    :success="valid"
                    :label="$t('password')"
                    :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye'"
                    :type="show ? 'text' : 'password'"
                    outlined
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
                    v-model="confirmation"
                    :error-messages="errors"
                    :success="valid"
                    :label="$t('repeatPassword')"
                    :append-icon="show1 ? 'mdi-eye-off-outline' : 'mdi-eye'"
                    outlined
                    required
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <LanguageSelector :model.sync="user.lang" />
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <CountrySelect :model.sync="user.country" />
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <PhoneNumber
                  :model.sync="user.mobile"
                  :country-code="user.country"
                />
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <UserCreationOption @sendOptions="updateOptions" />
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
                  {{ title }}
                </v-btn>
                <v-btn
                  x-large
                  color="middle white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                  @click="clearForm"
                >
                  {{ $t('reset') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </div>
    </v-card>
  </div>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'UserForm',
  props: {
    title: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      roleList: [
        {
          name: 'superAdmin',
          value: 'SA',
        },
        {
          name: 'Admin',
          value: 'AD',
        },
        {
          name: 'Viewer',
          value: 'VI',
        },
      ],
      confirmation: '',
      show: false,
      show1: false,
      isDisabled: false,
      user: {
        username: '',
        email: '',
        password: '',
        role: '',
        lang: '',
        options: [],
      },
    };
  },
  methods: {
    updateOptions(value) {
      this.user.options = value;
    },
    async onSubmit() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const [err, data] = await to(
        this.$store.dispatch('user/addUser', this.user),
      );
      if (err) {
        this.isDisabled = false;
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 1000);
      }

      if (data) {
        this.isDisabled = true;

        setTimeout(() => {
          this.$router.push(
            this.localeRoute({
              name: 'user-list',
            }),
          );
        }, 1500);
        this.clearForm();
      }
    },

    clearForm() {
      this.user.username = '';
      this.user.email = '';
      this.user.password = '';
      this.user.mobile = '';
      this.user.country = '';
      this.user.lang = '';
      this.user.role = '';
      this.user.options = [];
      this.$nextTick(() => {
        this.$refs.obs.reset();
      });
    },
  },
};
</script>
