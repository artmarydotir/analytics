<template>
  <ValidationProvider
    v-slot:default="{ errors, valid }"
    :rules="{ required: true }"
    :name="$t('primaryOwner')"
  >
    <v-autocomplete
      v-model="innerValue"
      :items="userDocs"
      item-text="username"
      item-value="id"
      autocomplete
      :error-messages="errors"
      cache-items
      :success="valid"
      outlined
      :label="$t('selectPrimaryOwner')"
      :search-input.sync="search"
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
    addingConfirmation: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      userDocs: [],
      search: '',
      innerValue: undefined,
      dataLoaded: false,
    };
  },

  watch: {
    search(value) {
      if (this.dataLoaded || this.addingConfirmation) {
        debounce(this.fetchNewList, 900)(value);
      }
    },
    fillingId(value) {
      this.callUserList();
      this.$watch('search', () => {
        this.dataLoaded = true;
      });
    },
  },

  mounted() {
    if (this.fillingId) {
      const self = this;

      self.$nextTick(() => {
        self.dataLoaded = false;
      });
    }
  },
  methods: {
    sendData(v) {
      this.$emit('sendPrimeryUserValue', v);
    },
    async callUserList() {
      let data = {};

      [, data] = await to(
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
        this.userDocs = data.docs.map((item) => {
          return {
            id: item.id,
            username: item.username,
          };
        });
        this.innerValue = this.userDocs[0].id;
      } else {
        this.$store.commit('SET_NOTIFICATION', {
          show: true,
          color: 'red',
          message: 'error',
        });
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
        this.userDocs = data.docs;
      } else {
        this.$store.commit('SET_NOTIFICATION', {
          show: true,
          color: 'red',
          message: 'error',
        });
      }
    },
  },
};
</script>
