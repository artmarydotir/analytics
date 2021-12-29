<template>
  <v-row class="mb-4">
    <v-col cols="12">
      {{ crumbs }}

      <div v-if="crumbs.length != 0">
        <v-card tile :elevation="$vuetify.theme.dark ? 9 : 8" class="pa-2">
          <ul class="d-inline-flex items-center">
            <li>
              <nuxt-link :to="localePath({ name: 'dashboard' })">
                {{ $t('dashboard') }}
              </nuxt-link>

              <v-icon x-small class="pr-2 pl-2">mdi-arrow-right</v-icon>
            </li>
            <li v-for="(item, i) in crumbs" :key="i">
              <nuxt-link :to="localePath({ path: item.href })" class="">
                {{ item.text }}
              </nuxt-link>

              <v-icon v-if="i != crumbs.length - 1" x-small class="pr-2 pl-2">
                mdi-arrow-right
              </v-icon>
            </li>
          </ul>
          <!-- <v-breadcrumbs :items="crumbs">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                :disabled="item.disabled"
                :to="localePath({ path: item.href })"
              >
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs> -->
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
        // eslint-disable-next-line no-unused-vars
        const removeLang = item.path.replace(/^\/[a-z]{2}/, '');

        const parent = item.name.split('-').slice(0, 1).join('-');

        const cleanText = item.name.replace(/_.*/, '');

        const makeCamelText = cleanText.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase(),
        );

        console.log(window.applicationBaseURL);
        crumbs.push({
          text: this.$t(parent),
          href: ``,
          disabled: true,
          classes: 'is-active',
        });
        crumbs.push({
          text: this.$t(makeCamelText),
          disabled: false,
          href: removeLang,
          classes: 'is-active',
        });

        //   console.log(item.meta.crumb);
        //   crumbs.push({
        //     text: item.meta.crumb,
        //     disabled: item.meta.disabled,
        //     to: item.path,
        //   });
        // }
      });
      // this.$route.matched.forEach((item, i, { length }) => {
      //   const crumb = {};
      //   crumb.href = item.path;
      //   crumb.text = this.$i18n.t('route.' + (item.name || item.path));

      //   // is last item?
      //   if (i === length - 1) {
      //     // is param route? .../.../:id
      //     if (item.regex.keys.length > 0) {
      //       crumbs.push({
      //         href: item.path.replace(/\/:[^/:]*$/, ''),
      //         text: this.$i18n.t('route.' + item.name.replace(/-[^-]*$/, '')),
      //       });
      //       crumb.href = this.$route.path;
      //       crumb.text = this.$i18n.t('route.' + this.$route.name, [
      //         crumb.href.match(/[^/]*$/)[0],
      //       ]);
      //     }
      //     // crumb.classes = 'is-active';
      //   }

      //   crumbs.push(crumb);
      // });

      return crumbs;
    },
  },
};
</script>
