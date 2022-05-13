<template>
  <div class="mx-auto">
    <Snackbar />

    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="pa-4">
        <v-icon> mdi-{{ mainIcon }} </v-icon>
        <span class="pl-2 pr-2">
          {{ title }}
        </span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
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
              <v-col v-if="editMood" cols="12" md="6" lg="3">
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
              <v-col cols="12" md="6" lg="3">
                <SelectPrimaryOwner
                  :filling-id="innerProject.primaryOwner"
                  :is-required="true"
                  @sendPrimaryUserValue="onSendPrime"
                />
              </v-col>
              <v-col v-if="!editMood" cols="12" md="6" lg="4">
                <ProjectCreationOption @sendOptions="updateOptions" />
              </v-col>
              <v-col v-if="editMood" cols="12" md="4" lg="3">
                <ProjectPrivateToken :project-id="innerProject.id" />
              </v-col>
              <v-col v-if="editMood" cols="12" md="6" lg="4">
                <ProjectUpdateOption
                  :value.sync="project.options"
                  @sendOptions="receiveOptions"
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
                    ? 'd-flex justify-end align-end mt-8'
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
import routingFn from '@/mixin/routingFn';
const { to } = require('await-to-js');

export default {
  name: 'ProjectForm',
  mixins: [routingFn],
  props: {
    title: {
      required: true,
      type: String,
    },
    project: {
      type: Object,
      required: false,
      default: () => ({
        userAndRules: [],
      }),
    },
    editMood: {
      required: false,
      type: Boolean,
      default: false,
    },
    mainIcon: {
      required: true,
      type: String,
      default: 'mdi-account-circle',
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
    onSendPrime(data) {
      this.$set(this.innerProject, 'primaryOwner', data.id);
    },
    updateOptions(value) {
      this.$set(this.innerProject, 'options', value);
    },
    async onSubmit() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }
      console.log('000');
      if (this.editMood) {
        await this.editingMethod();
      } else {
        await this.creatingMethod();
      }
    },
    async editingMethod() {
      const re = this.updatingFunction();
      const [, data] = await to(
        this.$store.dispatch('project/updateProject', re),
      );

      if (data) {
        this.redirecting('project-list');
      } else {
        this.errorCallback();
      }
    },

    async creatingMethod() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      const [, data] = await to(
        this.$store.dispatch('project/addProject', this.innerProject),
      );
      if (data) {
        this.redirecting('project-list');
      } else {
        this.errorCallback();
      }
    },

    updatingFunction() {
      const cloneData = { ...this.innerProject };
      cloneData.options = this.temporaryOptions;
      delete cloneData.publicToken;
      delete cloneData.id;

      // delete null values
      Object.keys(cloneData).forEach((key) => {
        if (cloneData[key] === null) {
          delete cloneData[key];
        }
      });

      return {
        id: this.innerProject.id,
        data: cloneData,
      };
    },

    receiveRules(value) {
      this.$set(this.innerProject, 'userAndRules', value);
    },

    receiveOptions(options) {
      this.temporaryOptions = options;
    },
  },
};
</script>
