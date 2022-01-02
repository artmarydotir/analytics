<template>
  <v-navigation-drawer
    v-model="drawerState"
    :right="dirMode"
    app
    clipped
    persistent
    fixed
    width="330px"
  >
    <v-sheet class="pa-4">
      <v-list-item-avatar>
        <v-icon color="green" large>mdi-alarm-light-outline</v-icon>
      </v-list-item-avatar>
      <div>
        {{ $t('projectDescription') }}
      </div>
    </v-sheet>
    <v-divider></v-divider>
    <Menu />
  </v-navigation-drawer>
</template>
<script>
export default {
  name: 'Nav',
  computed: {
    dirMode() {
      return this.$vuetify.rtl;
    },
    drawerState: {
      get() {
        return this.$store.getters.drawerState;
      },
      set(v) {
        return this.$store.commit('TOGGLE_DRAWER_STATE', v);
      },
    },
  },
};
</script>
