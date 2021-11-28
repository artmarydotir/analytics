<template>
  <div class="mx-auto">
    <Snackbar />

    {{ innerDomain }}
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
                  :rules="{
                    required: disableWDomain,
                    isDomain: { wild: false },
                  }"
                  :name="$t('domain')"
                >
                  <v-text-field
                    v-model.trim="innerDomain.domain"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :disabled="disableDomain"
                    :label="$t('domain')"
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  :rules="{
                    required: disableDomain,
                    isDomain: { wild: true },
                  }"
                  :name="$t('wildCardDomain')"
                >
                  <v-text-field
                    v-model.trim="innerDomain.wildcardDomain"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :disabled="disableWDomain"
                    :label="$t('wildcardDomain')"
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col v-if="!editMood" cols="12" md="6" lg="4">
                <DomainCreationOption @sendOptions="updateOptions" />
              </v-col>
              <v-col v-if="editMood" cols="12" md="6" lg="4">
                <DomainUpdateOption
                  :value.sync="innerDomain.options"
                  @sendOptions="reciveOptions"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="innerDomain.description"
                  outlined
                  name="description"
                  filled
                  rows="3"
                  :label="$t('description')"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="8" lg="4">
                <SelectProject
                  :filling-id="innerDomain.ProjectId"
                  @sendProjectId="onSendProject"
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
const _ = require('lodash');

export default {
  name: 'DomainForm',
  props: {
    title: {
      type: String,
      default: '',
    },
    domain: {
      type: Object,
      required: false,
      default: () => ({
        domain: '',
        wildcardDomain: '',
        ProjectId: 0,
      }),
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
      temporaryOptions: {},
      disableDomain: false,
      disableWDomain: false,
    };
  },
  computed: {
    innerDomain: {
      get() {
        return this.domain;
      },
      set(newValue) {
        this.$emit('update:domain', newValue);
      },
    },
  },
  watch: {
    'innerDomain.domain'(newValue) {
      console.log(newValue);
      if (!_.isEmpty(newValue)) {
        this.disableWDomain = true;
      } else {
        this.disableWDomain = false;
      }
    },
    'innerDomain.wildcardDomain'(newValue) {
      console.log(newValue);
      if (!_.isEmpty(newValue)) {
        this.disableDomain = true;
      } else {
        this.disableDomain = false;
      }
    },
  },
  methods: {
    updateOptions(value) {
      this.$set(this.innerDomain, 'options', value);
    },
    reciveOptions(options) {
      this.temporaryOptions = options;
    },
    onSendProject(value) {
      console.log(typeof value.id);
      this.$set(this.innerDomain, 'ProjectId', value.id);
    },
    async onSubmit() {
      if (this.editMood) {
        await this.editingMethod();
      } else {
        await this.creatingMethod();
      }
    },

    async creatingMethod() {
      const [, data] = await to(
        this.$store.dispatch('domain/addDomain', this.innerDomain),
      );
      if (data) {
        this.redirecting();
      } else {
        this.errorCallback();
      }
    },

    redirecting() {
      this.isDisabled = true;
      setTimeout(() => {
        this.$router.push(
          this.localeRoute({
            name: 'domain-list',
          }),
        );
      }, 1100);
    },

    errorCallback() {
      this.isDisabled = false;
      setTimeout(() => {
        this.$store.commit('CLOSE_NOTIFICATION', false);
      }, 1000);
    },
  },
};
</script>
