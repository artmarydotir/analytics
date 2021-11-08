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
                  rules="required|alpha_spaces"
                  :name="$t('title')"
                >
                  <v-text-field
                    v-model.trim="innerProject.title"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('title')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  rules="required"
                  :name="$t('publicToken')"
                >
                  <v-text-field
                    v-model.trim="innerProject.publicToken"
                    :error-messages="errors"
                    :success="valid"
                    dir="ltr"
                    type="text"
                    outlined
                    required
                    :label="$t('publicToken')"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="innerProject.description"
                  outlined
                  name="description"
                  filled
                  rows="3"
                  :label="$t('description')"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <UserRoleSelector />
              </v-col>

              <v-col cols="12" md="6" lg="4">
                <ProjectCreationOption @sendOptions="updateOptions" />
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
  name: 'ProjectForm',
  props: {
    title: {
      required: true,
      type: String,
    },
    project: {
      required: true,
      type: Object,
    },
    editMood: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDisabled: false,
    };
  },
  computed: {
    innerProject: {
      get() {
        return this.project;
      },
      set(newValue) {
        this.$emit('update:project', newValue);
      },
    },
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
              name: 'project-list',
            }),
          );
        }, 1500);
        this.clearForm();
      }
    },

    clearForm() {
      this.$nextTick(() => {
        this.$refs.obs.reset();
      });
    },
  },
};
</script>
