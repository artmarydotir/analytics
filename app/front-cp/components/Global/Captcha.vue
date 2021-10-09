<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="7" class="d-flex mx-auto pt-0">
      <v-img
        class="text-center bgcolor"
        :src="`data:image/svg+xml;base64,${captchaImage}`"
        aspect-ratio="3.5"
      >
      </v-img>
      <v-btn
        large
        text
        icon
        color="pink"
        class="mt-2 mr-2 ml-2"
        @click="recaptcha"
      >
        <v-icon>mdi-lock-reset</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="12" md="12" class="pb-0">
      <!-- <ValidationProvider
        v-slot="{ errors, valid }"
        rules="required|length:6"
        :name="`${$t('captcha')}`"
      > -->
      <v-text-field
        v-model="captcha.value"
        :label="$t('captcha')"
        type="text"
        outlined
        dark
        :counter="max"
        :rules="captchaRule"
        required
        prepend-inner-icon="mdi-lock-question"
      >
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Captcha',
  data() {
    return {
      max: 6,
      captchaImage: null,
      captcha: {
        token: '',
        value: '',
      },
      captchaRule: [
        (v) => !!v || this.$t('required'),
        (v) => (v && v.length <= this.max) || 'code is 6 character',
      ],
    };
  },
  watch: {
    'captcha.value'(newVal, oldVal) {
      if (newVal.length === 6) {
        this.$emit('solvedCapatcha', this.captcha);
      }
    },
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    async getCaptcha() {
      try {
        const res = await this.$axios.$get('captcha');
        this.captcha.token = res.token;
        this.captchaImage = btoa(res.svg);
      } catch (e) {
        console.log(e);
      }
    },
    recaptcha() {
      this.captchaImage = '';
      this.getCaptcha();
    },
  },
};
</script>

<style lang="scss" scoped>
.bgcolor {
  background-color: rgb(255, 241, 255);
}
</style>
