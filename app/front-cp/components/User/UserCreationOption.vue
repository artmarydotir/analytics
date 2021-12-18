<template>
  <v-row>
    <v-col cols="12" md="6">
      <validation-provider
        v-slot:default="{ errors }"
        rules="required"
        :name="$t('active')"
      >
        <v-checkbox
          v-model="options.active"
          :label="$t('active')"
          :value="1"
          :error-messages="errors"
        ></v-checkbox>
      </validation-provider>
    </v-col>
    <v-col cols="12" md="6">
      <v-checkbox
        v-model="options.remove"
        :label="$t('remove')"
        :value="2"
      ></v-checkbox>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      options: {
        active: null,
        remove: null,
      },
    };
  },
  watch: {
    options: {
      handler(options) {
        const list = [];
        if (options.active) {
          list.push(options.active);
        }
        if (options.remove) {
          list.push(options.remove);
        }

        this.$emit('sendOptions', list);
        // this.$emit('update:options', list);
      },
      deep: true,
    },
  },
};
</script>
