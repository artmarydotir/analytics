<template>
  <v-footer
    padless
    absolute
    color="grey lighten-3"
    :fixed="$vuetify.breakpoint.lgAndUp ? true : false"
  >
    <v-col class="text-center" cols="12">
      <span>
        {{ $t('projectDescription') }}
      </span>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: 'IntroFooter',
};
</script>
