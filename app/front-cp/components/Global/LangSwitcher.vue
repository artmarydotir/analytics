<template>
  <div>
    <v-menu
      offset-y
      min-width="130"
      nudge-bottom="16"
      :dark="$vuetify.theme.dark"
      left
      origin="right right"
      :close-on-click="true"
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          text
          :color="color"
          dark
          class="nocase"
          :small="btnSize"
          v-on="on"
        >
          <span v-if="$i18n.locale == 'fa'" class="fn-t inline-b"> فا </span>
          <span v-if="$i18n.locale == 'en'" class="fn-t inline-b mr-1">
            En
          </span>
          <v-icon :size="iconSize" dark class="inline-b pr-2">mdi-earth</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="$i18n.setLocale(locale.code)"
          @change="checkDirection(locale.code)"
        >
          <v-list-item-title>{{ locale.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
const rtlLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];

export default {
  name: 'LangSwitcher',
  props: {
    color: {
      type: String,
      default: 'white',
    },
    iconSize: {
      type: String,
      default: 'medium',
    },
    btnSize: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultL: this.$i18n.locale,
    };
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales;
    },
  },
  methods: {
    checkDirection(locale) {
      this.$store.commit('SET_USER_LANG', locale);
      if (rtlLanguages.includes(locale)) {
        this.$vuetify.rtl = true;
      } else {
        this.$vuetify.rtl = false;
      }
    },
  },
};
</script>

<style>
.inline-b {
  display: inline-block;
}
.fn-t {
  font-size: 1.1em;
}
</style>
