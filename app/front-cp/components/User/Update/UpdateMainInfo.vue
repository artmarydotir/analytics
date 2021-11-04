<template>
  <v-row class="pa-5">
    <v-col cols="12">
      <Snackbar />
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

            <v-col v-if="userStateRole === 'SA'" cols="12" md="6" lg="4">
              <RoleSelector :model.sync="user.role" />
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
            <v-col v-if="userStateRole === 'SA'" cols="12" md="6" lg="4">
              <UserUpdateOption
                :value.sync="user.options"
                @sendOptions="reciveOptions"
              />
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
                Update
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
  name: 'EditMainData',
  props: {
    dataGiven: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      temporaryOptions: {},
      userStateRole: this.$store.getters['user/auth/GET_ROLE'],
      roleList: [
        {
          name: 'Super Admin',
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
      isDisabled: false,
    };
  },
  computed: {
    user: {
      cache: false,
      get() {
        return this.dataGiven;
      },
      set(newValue) {
        this.$emit('update:dataGiven', newValue);
      },
    },
  },
  methods: {
    reciveOptions(options) {
      this.temporaryOptions = options;
    },
    async onSubmit() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }

      const cloneUser = { ...this.user };
      delete cloneUser.options;
      cloneUser.options = this.temporaryOptions;
      delete cloneUser.id;
      if (this.userStateRole === 'VI' || this.userStateRole === 'AD') {
        delete cloneUser.role;
        delete cloneUser.options;
      }
      const updatedData = { id: this.user.id, data: cloneUser };

      const [err, data] = await to(
        this.$store.dispatch('user/updateUser', updatedData),
      );
      if (err) {
        this.isDisabled = false;
        console.log('error is here:', err);
      }
      if (data) {
        this.isDisabled = true;
        // if (this.loginRole.includes('SA')) {
        //   this.$router.push(
        //     this.localeRoute({
        //       name: 'user-list',
        //     }),
        //   );
        // } else {
        //   this.$router.push(
        //     this.localeRoute({
        //       name: 'user-profile',
        //     }),
        //   );
        // }
      }
    },
  },
};
</script>
