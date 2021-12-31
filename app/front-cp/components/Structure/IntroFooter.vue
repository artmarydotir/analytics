<template>
  <v-footer padless color="grey lighten-2" app>
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
