<template>
  <div class="mx-auto">
    <Snackbar />
    {{ innerProject }}
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
                  :rules="{ required: true, regex: /[a-zA-Z0-9\s]+/ }"
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
              <v-col v-if="editMood" cols="12" md="6" lg="4">
                <v-text-field
                  v-model="innerProject.publicToken"
                  dir="ltr"
                  type="text"
                  outlined
                  required
                  readonly
                  :label="$t('publicToken')"
                ></v-text-field>
              </v-col>

              <v-col v-if="!editMood" cols="12" md="6" lg="4">
                <ProjectCreationOption @sendOptions="updateOptions" />
              </v-col>
              <v-col v-if="editMood" cols="12" md="6" lg="4">
                <ProjectUpdateOption
                  :value.sync="project.options"
                  @sendOptions="reciveOptions"
                />
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
                <UserRuleSelector
                  :edit="editMood"
                  :looping-list-o="innerProject.userAndRules"
                  @sendData="receiveRules"
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
                  {{ title }}
                </v-btn>
                <v-btn
                  x-large
                  color="middle white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
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
      type: Object,
      required: false,
      default: () => ({}),
    },
    editMood: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      temporaryOptions: {},
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
      this.$set(this.innerProject, 'options', value);
    },
    async onSubmit() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }
      const re = this.updatingFunction();
      const [err, data] = await to(
        this.$store.dispatch('project/updateProject', re),
      );
      if (err) {
        this.isDisabled = false;
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 1000);
      }

      if (data) {
        console.log('im here');
        this.isDisabled = true;

        setTimeout(() => {
          this.$router.push(
            this.localeRoute({
              name: 'project-list',
            }),
          );
        }, 1500);
      }
    },

    updatingFunction() {
      const cloneData = { ...this.innerProject };
      cloneData.options = this.temporaryOptions;
      delete cloneData.publicToken;
      delete cloneData.id;
      return {
        id: this.innerProject.id,
        data: cloneData,
      };
    },
    receiveRules(value) {
      this.$set(this.innerProject, 'userAndRules', value);
    },
    reciveOptions(options) {
      this.temporaryOptions = options;
    },
  },
};
</script>
