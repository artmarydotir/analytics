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
                  rules="required|min:3"
                  :name="$t('name')"
                >
                  <v-text-field
                    v-model.trim="innerUptime.name"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('name')"
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  rules="required|url"
                  :name="$t('url')"
                >
                  <v-text-field
                    v-model.trim="innerUptime.url"
                    dir="ltr"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    type="text"
                    outlined
                    :label="$t('url')"
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col v-if="!editMood" cols="12" md="6" lg="4">
                <UptimeCreationOption @sendOptions="updateOptions" />
              </v-col>
              <v-col v-if="editMood" cols="12" md="6" lg="4">
                <UptimeUpdateOption
                  :value.sync="innerUptime.options"
                  @sendOptions="receiveOptions"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="innerUptime.description"
                  outlined
                  name="description"
                  filled
                  rows="3"
                  :label="$t('description')"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <ValidationProvider
                  v-slot:default="{ errors }"
                  rules="required|numeric"
                  :name="$t('interval')"
                >
                  <v-slider
                    v-model="innerUptime.interval"
                    :min="2"
                    :max="60"
                    :error-messages="errors"
                    :step="1"
                    :thumb-size="24"
                    thumb-color="primary"
                    thumb-label="always"
                    color="orange"
                    class="mt-4"
                    :label="$t('interval')"
                  ></v-slider>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="innerUptime.ping"
                  :label="$t('ping')"
                  :value="true"
                  :false-value="false"
                  :true-value="true"
                ></v-checkbox>
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
  name: 'UptimeForm',
  props: {
    title: {
      type: String,
      default: '',
    },
    uptime: {
      type: Object,
      required: false,
      default: () => ({
        name: '',
        url: '',
        interval: 4,
        ping: true,
        options: [1],
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
      isDisabled: false,
      temporaryOptions: {},
    };
  },
  computed: {
    innerUptime: {
      get() {
        return this.uptime;
      },
      set(newValue) {
        this.$emit('update:uptime', newValue);
      },
    },
  },
  methods: {
    updateOptions(value) {
      this.$set(this.innerUptime, 'options', value);
    },
    receiveOptions(options) {
      this.temporaryOptions = options;
    },
    async onSubmit() {
      const validity = await this.$refs.obs.validate();
      if (!validity) {
        return;
      }
      if (this.editMood) {
        await this.editingMethod();
      } else {
        await this.creatingMethod();
      }
    },

    async creatingMethod() {
      console.log('creating', this.innerUptime);
      const [, data] = await to(
        this.$store.dispatch('uptime/addUptime', this.innerUptime),
      );
      if (data) {
        this.redirecting();
      } else {
        this.errorCallback();
      }
    },

    async editingMethod() {
      const readyData = this.updatingFunction();

      const [, data] = await to(
        this.$store.dispatch('uptime/updateUptime', readyData),
      );

      if (data) {
        this.redirecting();
      } else {
        this.errorCallback();
      }
    },

    updatingFunction() {
      const cloneData = { ...this.innerUptime };

      console.log('cloneData', cloneData);
      cloneData.options = this.temporaryOptions;
      delete cloneData.id;
      return {
        id: this.innerUptime.id,
        data: cloneData,
      };
    },
    redirecting() {
      this.isDisabled = true;
      setTimeout(() => {
        this.$router.push(
          this.localeRoute({
            name: 'uptime-list',
          }),
        );
      }, 1100);
    },

    errorCallback() {
      this.isDisabled = false;
      // setTimeout(() => {
      //   this.$store.commit('CLOSE_NOTIFICATION', false);
      // }, 3000);
    },
  },
};
</script>
