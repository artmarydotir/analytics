<template>
  <v-dialog v-model="innerDialog" max-width="70%" @click:outside="close">
    <v-card>
      <v-card-title dark class="teal accent-4 darken-3 white--text pa-4">
        <span class="headline">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              dark
              small
              class="pa-3"
              v-bind="attrs"
              @click="copyText(info)"
              v-on="on"
            >
              <v-icon small dark> mdi-content-copy </v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('copyText') }}
          </span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <div class="pa-4">
          {{ $t('configTextShow') }}
        </div>

        <pre>{{ info }}</pre>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn dark color="primary" text @click.native="close">
          {{ $t('close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import copy from '@/mixin/copyToclipboard';

export default {
  name: 'CodeViewDialog',
  mixins: [copy],
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    closebtn: {
      type: String,
      default: 'Cancel',
    },
    info: {
      type: String,
      required: true,
    },
  },
  computed: {
    innerDialog: {
      get() {
        return this.dialog;
      },
      set(newValue) {
        this.$emit('update:dialog', newValue);
      },
    },
  },

  methods: {
    close() {
      this.$emit('update:dialog', false);
    },
  },
};
</script>
<style scoped>
pre {
  white-space: pre-wrap;
  direction: ltr;
  background-color: #2e2e2e;
  padding: 12px;
  color: whitesmoke;
}
</style>
