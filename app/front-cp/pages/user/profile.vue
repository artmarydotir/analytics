<template>
  <v-container class="pt-6 mb-4" fluid>
    <Snackbar />
    <UserProfile :profile="profileData" />
  </v-container>
</template>

<script>
const { to } = require('await-to-js');

export default {
  permissions: ['AD', 'SA', 'CL'],
  data() {
    return {
      profileData: {},
      userId: Number(this.$store.state.user.auth.userData.id),
    };
  },
  head() {
    return {
      title: `${this.$t('profile')}`,
    };
  },
  async mounted() {
    if (this.userId) {
      const [err, data] = await to(
        this.$store.dispatch('user/showProfile', this.userId),
      );
      if (err) {
        return;
      }
      if (data) {
        console.log('====>', data);
        this.profileData = data;
      }
    }
  },
};
</script>
