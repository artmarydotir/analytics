<template>
  <v-dialog v-model="dialog" width="600" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on">
        {{ $t('showPrivateToken') }}
        <v-icon right dark> mdi-eye </v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        {{ $t('showPrivateToken') }}
      </v-card-title>

      <v-card-text>
        <p class="body2 pt-5 pb-5">
          {{ $t('showPrivateTokenQuote') }}
        </p>
        <ValidationObserver ref="obs">
          <v-form novalidate="true" @submit.prevent="onSubmit">
            <v-row>
              <v-col v-show="showPassfield" cols="10" md="9" lg="9">
                <ValidationProvider
                  v-slot:default="{ errors, valid }"
                  rules="required"
                  :name="$t('password')"
                >
                  <v-text-field
                    v-model="password"
                    :label="$t('password')"
                    color="light-blue darken-1"
                    :error-messages="errors"
                    :success="valid"
                    :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye'"
                    :type="show ? 'text' : 'password'"
                    outlined
                    @click:append="show = !show"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <template v-if="isDataLoaded === true">
                <v-col cols="10" md="9" lg="9">
                  <v-text-field
                    v-model="prToken"
                    :label="$t('privateToken')"
                    color="light-blue darken-1"
                    readonly
                    outlined
                  >
                    <template v-slot:append-outer>
                      <v-btn text dark small color="primary" @click="copyText">
                        <v-icon small dark> mdi-content-copy </v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="2" md="3">
                  <v-btn
                    color="secondary"
                    fab
                    small
                    dark
                    class="mt-2"
                    @click="generate()"
                  >
                    <v-icon>mdi-reload</v-icon>
                  </v-btn>
                </v-col>
              </template>
            </v-row>
            <v-col
              cols="12"
              :class="
                $vuetify.breakpoint.smAndUp
                  ? 'd-flex justify-end align-end'
                  : ''
              "
            >
              <v-btn color="error" class="mr-2 ml-2" text @click="close()">
                {{ $t('close') }}
              </v-btn>
              <v-btn
                :disabled="isDisabled"
                type="submit"
                color="primary white--text"
              >
                {{ $t('showPrivateToken') }}
              </v-btn>
            </v-col>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'ProjectPrivateToken',
  props: {
    projectId: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      show: false,
      dialog: false,
      isDisabled: false,
      password: null,
      prToken: '',
      isDataLoaded: false,
      showPassfield: true,
    };
  },
  methods: {
    async onSubmit() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }
      const [, data] = await to(
        this.$store.dispatch('project/showPrivateToken', {
          password: this.password,
          projectId: this.projectId,
        }),
      );

      if (data) {
        this.isDataLoaded = true;
        this.showPassfield = false;
        this.isDisabled = true;
        this.prToken = data.pToken;
      } else {
        this.isDataLoaded = this.isDisabled = false;
        this.showPassfield = true;
      }
    },
    copyText() {
      navigator.clipboard.writeText(this.prToken);
    },
    async generate() {
      const [, data] = await to(
        this.$store.dispatch('project/generatePrivateToken', this.projectId),
      );

      if (data) {
        this.prToken = data;
      } else {
        this.prToken = '';
        this.dialog = false;
      }
    },
    close() {
      this.prToken = '';
      this.password = '';
      this.dialog = false;
      this.showPassfield = true;
      this.isDisabled = false;
      this.isDataLoaded = false;
    },
  },
};
</script>
