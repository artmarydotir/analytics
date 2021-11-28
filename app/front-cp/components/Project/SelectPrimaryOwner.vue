<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{
      required: isRequired,
    }"
    :name="$t('primaryOwner')"
  >
    {{ isRequired }} {{ errors }} {{ valid }}
    <v-autocomplete
      v-model="model"
      :items="userDocs"
      :loading="isLoading"
      :search-input.sync="search"
      item-text="username"
      item-value="id"
      autocomplete
      :error-messages="errors"
      cache-items
      :success="valid"
      outlined
      return-object
      :label="$t('selectPrimaryOwner')"
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
    isRequired: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      entries: [],
      isLoading: false,
      model: {
        id: 0,
        username: null,
      },
      search: null,
    };
  },
  computed: {
    userDocs() {
      return this.entries.map((entry) => ({
        id: entry.id,
        username: entry.username,
      }));
    },
  },

  watch: {
    search(val) {
      if (val !== this.model.username) {
        this.isLoading = true;
        debounce(this.fetchNewList, 1500)(val);
      }

      if (this.entries.length > 0 || this.isLoading) return;

      this.isLoading = false;
    },
  },
  mounted() {
    if (this.fillingId) {
      console.log('fillingId:', this.fillingId);
      this.findUserById();
    } else {
      this.fetchNewList();
    }
  },

  methods: {
    sendData(v) {
      this.$emit('sendPrimeryUserValue', v);
    },
    async findUserById() {
      const [, data] = await to(
        this.$store.dispatch('user/list/listUser', {
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
        this.$store.dispatch('user/list/listUser', {
          lastSeen: undefined,
          limit: 20,
          filter: {
            // arrIn_options: [1],
            like_username: this.search ? this.search : undefined,
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
