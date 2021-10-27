<template>
  <v-snackbar
    v-model="snackbar.show"
    transition="scroll-y-transition"
    :color="snackbar.color"
    timeout="-1"
    top="top"
  >
    <span>
      {{ snackbar.message }}
    </span>

    <template v-slot:action="{ attrs }">
      <v-btn
        dark
        text
        v-bind="attrs"
        @click="$store.commit('CLOSE_NOTIFICATION', !snackbar.show)"
      >
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'Snackbar',

  computed: {
    ...mapState({
      snackbar: (state) => state.snackbar,
    }),
  },
  beforeCreate() {
    this.$store.commit('CLOSE_NOTIFICATION', false);
  },
  created() {
    this.$store.commit('SET_NOTIFICATION', {
      message: '',
      show: false,
    });
  },
};
</script>
