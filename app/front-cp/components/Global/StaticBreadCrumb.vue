<template>
  <v-row class="mb-3">
    <v-col cols="12">
      <v-card class="pa-2" :elevation="$vuetify.theme.dark ? 9 : 8">
        <v-breadcrumbs :items="crumbs" divider="-">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              :to="localePath(item.to)"
              :disabled="item.disabled"
              :active-class="
                item.to !== $route.path ? 'middle--text' : undefined
              "
              @click.native="item.refresh && $router.go()"
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
          <template v-slot:divider>
            <v-icon>mdi-chevron-{{ $vuetify.rtl ? 'left' : 'right' }}</v-icon>
          </template>
        </v-breadcrumbs>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    crumbs: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
