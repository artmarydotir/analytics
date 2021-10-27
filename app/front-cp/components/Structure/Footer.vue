<template>
  <v-footer padless fixed app>
    <v-col class="text-center" cols="12">
      <span class="caption">
        {{ $t('projectDescription') }}
      </span>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: 'GlobalFooter',
};
</script>
