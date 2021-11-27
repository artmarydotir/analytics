<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: true }"
    :name="$t('selectProject')"
  >
    {{ model }}
    <v-autocomplete
      v-model="model"
      :items="entries"
      :loading="isLoading"
      item-text="title"
      item-value="id"
      :error-messages="errors"
      cache-items
      :success="valid"
      outlined
      :label="$t('selectProject')"
      :search-input.sync="search"
      return-object
      @change="sendData"
    >
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import debounce from 'lodash/debounce';
const { to } = require('await-to-js');

export default {
  props: {
    fillingId: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      entries: [],
      isLoading: false,
      model: {
        id: 0,
        title: '',
      },
      search: null,
    };
  },
  computed: {
    items() {
      return this.entries;
    },
  },

  watch: {
    search(val) {
      if (val !== this.model.title) {
        this.isLoading = true;
        debounce(this.fetchNewList, 1500)(val);
      }

      if (this.entries.length > 0 || this.isLoading) return;

      this.isLoading = false;
    },
  },
  mounted() {
    if (this.fillingId) {
      this.findProjectById();
    } else {
      this.fetchNewList();
    }
  },

  methods: {
    sendData(v) {
      this.$emit('sendProjectId', v);
    },

    async findProjectById() {
      let data = {};

      [, data] = await to(
        this.$store.dispatch('project/list/simpleProjectList', {
          lastSeen: undefined,
          limit: 20,

          filter: {
            // arrIn_options: [1],
            ids_id: this.fillingId,
          },
        }),
      );

      if (data) {
        this.entries = data.docs;
        this.model = this.entries[0];
        this.isLoading = false;
      }
    },
    async fetchNewList() {
      const [, data] = await to(
        this.$store.dispatch('project/list/simpleProjectList', {
          lastSeen: undefined,
          limit: 20,
          filter: {
            // arrIn_options: [1],
            like_title: this.search ? this.search : undefined,
          },
        }),
      );

      if (data) {
        this.entries = data.docs;
        this.isLoading = false;
      }
    },
  },
};
</script>
