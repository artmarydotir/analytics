<template>
  <v-menu
    transition="slide-x-transition"
    right
    bottom
    offset-y
    nudge-bottom="16"
  >
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item exact :to="localePath('user-profile')" color="blue">
        <v-list-item-title>
          {{ $t('showProfile') }}
        </v-list-item-title>
      </v-list-item>
      <!-- <v-list-item
        color="blue"
        exact
        :to="localePath({ name: 'user-edit-id', params: { id: userId } })"
      >
        <v-list-item-title>
          {{ $t('editProfile') }}
        </v-list-item-title>
      </v-list-item> -->

      <v-divider></v-divider>
      <v-list-item @click="logOut">
        <v-list-item-title>
          {{ $t('logOut') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { to } from 'await-to-js';
export default {
  name: 'ToolbarMenu',
  data() {
    return {
      // userId: this.$store.state.user.auth.userData.id,
    };
  },
  methods: {
    async logOut() {
      const [err, data] = await to(this.RestLogout());
      if (data.status === 204) {
        this.$store.commit('user/auth/CLEAR_USER_DATA');
        this.$router.push(this.localePath({ name: 'index' }));
      }
      if (err) {
        this.$store.commit('SET_NOTIFICATION', {
          show: true,
          color: 'red',
          message: `${err.message}`,
        });
      }
    },

    async RestLogout() {
      return await this.$axios.get(
        `${window.applicationBaseURL}api/open-api/user/logout`,
      );
    },
  },
};
</script>
