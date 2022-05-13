<template>
  <v-row v-if="showBox" justify="center" align="center">
    <v-col cols="12" md="8" class="mx-auto pt-0">
      <v-row justify="center" align="center">
        <v-col cols="10" class="pl-1 pr-1">
          <v-img class="d-flex text-center" :src="captchaImage"> </v-img>
        </v-col>
        <v-col cols="2" class="pl-1 pr-1">
          <v-btn large text icon color="red" class="d-flex" @click="recaptcha">
            <v-icon>mdi-repeat</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="pb-0">
      <ValidationProvider
        v-slot:default="{ errors }"
        :name="$t('captcha')"
        :rules="{ required: isRequired, min: 3, max: 6 }"
      >
        <v-text-field
          v-model="captcha.value"
          :label="$t('captcha')"
          type="text"
          outlined
          dir="ltr"
          :counter="max"
          :error-messages="errors"
          required
          prepend-inner-icon="mdi-code-tags"
        />
      </ValidationProvider>
    </v-col>
  </v-row>
</template>

<script>
const { to } = require('await-to-js');

export default {
  name: 'Captcha',
  data() {
    return {
      showBox: false,
      max: 6,
      min: 3,
      captchaImage: null,
      captcha: {
        id: '',
        value: '',
      },
    };
  },
  computed: {
    isRequired() {
      return this.showBox;
    },
  },
  watch: {
    'captcha.value'(v) {
      if (v.length >= this.min && v.length <= this.max) {
        this.$emit('solvedCaptcha', this.captcha);
      }
    },
  },
  mounted() {
    this.captchaCall();
  },
  methods: {
    async captchaCall() {
      const [, res] = await to(
        this.$store.dispatch('user/getCaptcha', this.$i18n.locale),
      );

      if (res.id === '') {
        this.showBox = false;
      } else {
        this.showBox = true;
        this.captcha.id = res.id;
        this.captchaImage = res.image;
      }
    },

    async recaptcha() {
      this.captchaImage = '';
      await this.captchaCall();
    },
  },
};
</script>
