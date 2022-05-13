<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="8" lg="9">
      <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
        <v-tabs
          v-model="tab"
          centered
          :background-color="$vuetify.theme.dark ? '' : 'grey lighten-3'"
          :grow="$vuetify.breakpoint.smAndDown ? true : false"
          :fixed-tabs="$vuetify.breakpoint.mdAndUp ? true : false"
          :icons-and-text="$vuetify.breakpoint.mdAndUp"
          slider-size="4"
          show-arrows
        >
          <v-tabs-slider color="primary"></v-tabs-slider>

          <v-tab href="#tab-2" class="pb-2">
            {{ $t('editData') }}
            <v-icon>mdi-account-plus</v-icon>
          </v-tab>
          <v-tab href="#tab-3" class="pb-2">
            {{ $t('editPassword') }}
            <v-icon>mdi-key-plus</v-icon>
          </v-tab>
          <v-tab href="#tab-4" class="pb-2">
            {{ $t('otp') }}
            <v-icon>mdi-account-key</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="my-6">
          <v-tab-item value="tab-2">
            <UpdateMainInfo :data-given="userInfo" />
          </v-tab-item>
          <v-tab-item value="tab-3">
            <LazyUpdatePassword :user-id="userInfo.id" />
          </v-tab-item>

          <v-tab-item value="tab-4">
            <LazyUpdateOtpActivate :user-id="userInfo.id" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { to } from 'await-to-js';

export default {
  name: 'UserUpdateWrapper',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      userInfo: {},
      tab: null,
    };
  },
  async mounted() {
    if (this.id) {
      const [err, result] = await to(
        this.$store.dispatch('user/showProfile', this.id),
      );
      if (result) {
        this.userInfo = { ...result };
      }
      if (err) {
        // console.log('98888888888899999', err['0'].extensions.code);
        // return this.$nuxt.error({
        //   statusCode: err['0'].extensions.code,
        // });
      }
    }
  },
};
</script>
