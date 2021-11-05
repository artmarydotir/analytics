<template>
  <v-dialog v-model="innerDialog" max-width="600px" @click:outside="close">
    <v-card :loading="loading">
      <v-card-title dark class="teal white--text pa-4">
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <div class="pa-4">
          <slot name="dialogbody" />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark color="blue darken-1" @click.native="doneEvent">
          {{ okbtn }}
        </v-btn>
        <v-btn dark color="warning" @click.native="close">
          {{ closebtn }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'ListDialog',

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
    okbtn: {
      type: String,
      default: 'Save',
    },
    doneEvent: {
      type: Function,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
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
