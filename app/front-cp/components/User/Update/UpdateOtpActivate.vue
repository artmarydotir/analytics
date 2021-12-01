<template>
  <v-row class="pa-5">
    <Snackbar />
    <v-col cols="12">
      <v-alert text type="info" icon="mdi-shield-lock-outline">
        {{ $t('otpguidemessage1') }}
      </v-alert>
      <v-row class="pt-2 pb-4">
        <v-col
          v-for="app in applications"
          :key="app.name"
          cols="12"
          lg="6"
          class="d-flex justify-center"
        >
          <v-card width="500">
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>
                {{ app.name }}
              </v-toolbar-title>
            </v-toolbar>

            <v-list>
              <v-list-item
                v-for="(item, i) in app.items"
                :key="i"
                :href="item.link"
                target="_blank"
              >
                <v-list-item-icon>
                  <v-icon color="orange">
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="body-2">
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <ValidationObserver ref="obs">
        <v-alert text type="info" icon="mdi-shield-lock-outline">
          {{ $t('otpGuideMessage2') }}
        </v-alert>
        <v-form novalidate="true" :disabled="isDisabled">
          <v-row justify="center">
            <v-col v-if="userStateRole !== 'SA'" cols="12" md="4">
              <ValidationProvider
                v-slot:default="{ errors, valid }"
                rules="required"
                :name="$t('password')"
              >
                <v-text-field
                  v-model.trim="password"
                  :error-messages="errors"
                  :success="valid"
                  :label="$t('password')"
                  :append-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye'"
                  :type="show ? 'text' : 'password'"
                  outlined
                  required
                  prepend-inner-icon="mdi-lock-outline"
                  @click:append="show = !show"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                :disabled="isDisabled"
                x-large
                block
                color="primary white--text"
                class="mr-1 ml-1 pl-12 pr-12"
                @click="generateQrcode"
              >
                {{ $t('showSvg') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </ValidationObserver>
      <!-- svg bg  -->
      <v-row v-if="showCodeBox" justify="center" align="center">
        <v-col v-if="imagePath" md="4" offset-md="1">
          <v-img
            contain
            max-width="240"
            :src="imagePath"
            class="text-center blue lighten-4"
          ></v-img>
        </v-col>
        <v-col md="2" class="d-flex justify-center">
          <v-btn
            fab
            dark
            outlined
            large
            :color="countDown < 30 ? 'red' : 'green'"
            class="mx-auto font-weight-medium text-h4"
          >
            {{ countDown }}
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import QRCode from 'qrcode';
import otpData from '@/mixin/otpdata';
const { to } = require('await-to-js');

export default {
  name: 'OtpActivate',
  mixins: [otpData],
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      userStateRole: this.$store.getters['user/auth/GET_ROLE'],
      password: '',
      showCodeBox: false,
      countDown: 60,
      show: false,
      isDisabled: false,
      imagePath: '',
    };
  },

  methods: {
    countDownTimer() {
      if (this.countDown > 1) {
        setTimeout(() => {
          this.countDown--;
          this.countDownTimer();
        }, 1000);
      } else {
        this.showCodeBox = false;
        this.countDown = 60;
      }
    },
    setNewOtpSecret(secret) {
      this.isDisabled = true;
      const uri = {
        title: 'aasaam analytics',
        otpSecret: secret,
        host: window.location.hostname,
      };

      QRCode.toDataURL(
        `otpauth://totp/${uri.title}:${uri.host}?secret=${uri.otpSecret}&issuer=${uri.title}`,
      )
        .then((url) => {
          this.imagePath = url;
          this.showCodeBox = true;
          this.countDownTimer();
          setTimeout(() => {
            this.showCodeBox = false;
            this.imagePath = '';
            this.isDisabled = false;
          }, 60000);
        })
        .catch((err) => {
          this.showCodeBox = false;
          this.isDisabled = false;
          this.imagePath = '';
          console.error(err);
        });
    },
    async generateQrcode() {
      this.isDisabled = true;
      if (!this.userId) {
        return;
      }
      const [err, secret] = await to(
        this.$store.dispatch('user/otp/otpGenerate', {
          id: this.userId,
          currentPassword: this.password,
        }),
      );
      if (err) {
        setTimeout(() => {
          this.$store.commit('CLOSE_NOTIFICATION', false);
        }, 800);
        this.isDisabled = false;
      }
      if (secret) {
        this.setNewOtpSecret(secret);
      }
    },
  },
};
</script>
