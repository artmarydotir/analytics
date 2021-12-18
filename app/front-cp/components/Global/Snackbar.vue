<template>
  <v-snackbar
    v-model="snackbar.show"
    transition="scroll-y-transition"
    :color="snackbar.color"
    timeout="-1"
    top="top"
    multi-line
  >
    <template v-if="snackbar.status === 'success'">
      {{ $t(`success.${snackbar.message}`) }}
    </template>
    <template v-else-if="snackbar.status === 'hint'">
      {{ $t(`errors.${snackbar.message}`) }}
    </template>

    <div
      v-else-if="
        snackbar.message &&
        typeof snackbar.message === 'array' &&
        snackbar.message.length > 0
      "
    >
      <p class="font-weight-bold text-center">
        <span v-if="snackbar.message[0].message === 'UNPROCESSABLE_ENTITY'">
          {{ $t('errors.UNPROCESSABLE_ENTITY') }}
        </span>
        <span v-if="snackbar.message[0].message === 'DUPLICATE_ENTRY'">
          {{ $t('errors.DUPLICATE_ENTRY') }}
        </span>
        <span v-else>
          {{ snackbar.message[0].message }}
        </span>
      </p>
      <v-divider></v-divider>
      <template
        v-if="
          snackbar.message &&
          snackbar.message[0] &&
          snackbar.message[0].extensions
        "
      >
        <v-list-item
          v-for="(err, index) in snackbar.message[0].extensions.validation"
          :key="index"
          dense
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-icon x-small> mdi-info </v-icon>
              {{
                $t('errMsg', {
                  item: `${err.field}`,
                  rule: $t(`${err.message}`),
                })
              }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </div>
    <template v-else> {{ $t(`errors.${snackbar.message}`) }} </template>

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
