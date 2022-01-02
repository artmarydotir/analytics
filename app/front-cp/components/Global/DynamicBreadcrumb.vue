<template>
  <v-row class="mb-4">
    <v-col cols="12">
      <div v-if="crumbs.length != 0">
        <v-card tile :elevation="$vuetify.theme.dark ? 9 : 8" class="pa-2">
          <ul class="d-inline-flex items-center">
            <li>
              <nuxt-link :to="localePath({ name: 'dashboard' })">
                {{ $t('dashboard') }}
              </nuxt-link>

              <v-icon x-small class="pr-2 pl-2">
                mdi-arrow-{{ $vuetify.rtl ? 'left' : 'right' }}
              </v-icon>
            </li>
            <li v-for="(item, i) in crumbs" :key="i">
              <nuxt-link :to="localePath({ path: item.href })" class="">
                {{ item.text }}
              </nuxt-link>

              <v-icon v-if="i != crumbs.length - 1" x-small class="pr-2 pl-2">
                mdi-arrow-{{ $vuetify.rtl ? 'left' : 'right' }}
              </v-icon>
            </li>
          </ul>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  computed: {
    crumbs() {
      const crumbs = [];
      this.$route.matched.forEach((item) => {
        console.log(item);

        const removeLang = item.path.replace(/^\/[a-z]{2}/, '');

        const cleanText = item.name.replace(/_.*/, '');

        const makeCamelText = cleanText.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase(),
        );

        crumbs.push({
          text: this.$t(makeCamelText),
          disabled: false,
          href: removeLang,
          classes: 'is-active',
        });
      });

      return crumbs;
    },
  },
};
</script>
