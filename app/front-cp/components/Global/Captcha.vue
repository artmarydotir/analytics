<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="6" class="d-flex mx-auto pt-0">
      <v-img class="text-center bgcolor" :src="captchaImage"> </v-img>
      <v-btn
        large
        text
        icon
        color="red"
        class="mt-2 mr-2 ml-2"
        @click="recaptcha"
      >
        <v-icon>mdi-repeat</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="12" class="pb-0">
      <ValidationProvider
        v-slot:default="{ errors }"
        :name="$t('captcha')"
        :rules="{ required: true, min: 3, max: 6 }"
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
export default {
  name: 'Captcha',
  data() {
    return {
      max: 6,
      min: 3,
      captchaImage: null,
      captcha: {
        id: '',
        value: '',
      },
    };
  },
  watch: {
    'captcha.value'(v) {
      if (v.length >= this.min && v.length <= this.max) {
        this.$emit('solvedCaptcha', this.captcha);
      }
    },
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    async getCaptcha() {
      try {
        const res = await this.$axios.$get(
          `${window.applicationBaseURL}api/open-api/captcha`,
        );

        this.captcha.id = res.id;
        this.captchaImage = res.image;
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
  background-color: rgb(203, 190, 226);
}
</style>
