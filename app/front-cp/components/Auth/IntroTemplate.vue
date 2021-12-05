<template>
  <v-row justify="center" class="ma-0 pa-0">
    <v-col cols="12" class="ma-0 pa-12 primary">
      <v-sheet min-height="220" color="primary">
        <h1
          class="
            mx-auto
            justify-center
            font-weight-bold
            text-h3 text-center
            white--text
            pb-10
            pt-4
          "
        >
          {{ title }}
        </h1>
      </v-sheet>
    </v-col>

    <v-col cols="10" md="8" lg="5" class="ma-0 pa-0 mt-n16">
      <div class="mt-n16">
        <slot name="frame">
          This is the default content if nothing gets specified to go here
        </slot>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IntroTemplate',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
