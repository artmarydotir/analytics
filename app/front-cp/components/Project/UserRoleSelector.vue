<template>
  <v-row>
    <pre>
      {{ user }}
    </pre>
    <v-col cols="12">
      <ValidationProvider v-slot:default="{ errors, valid }" name="country">
        <v-autocomplete
          v-model="user"
          :items="items"
          outlined
          :error-messages="errors"
          :success="valid"
          item-text="username"
          item-value="id"
          autocomplete
          chips
          cache-items
          hide-no-data
          hide-details
          clearable
          return-object
          :label="$t('selectUser')"
          :search-input.sync="search"
        >
          <template slot="item" slot-scope="{ item }">
            <v-icon> mdi-account-circle </v-icon>
            {{ item.username }}
          </template>
        </v-autocomplete>
      </ValidationProvider>
    </v-col>
    {{ cat }}
    <v-col>
      <v-row v-for="(item, i) in user" :key="i">
        <v-col cols="2">
          <span>
            {{ item.username }}
          </span>
        </v-col>
        <v-col cols="28">
          <v-select
            v-model="cat[item.id]"
            :items="category"
            :label="$t('selectRole')"
            outlined
            chips
            multiple
            @input="addToList(item.id)"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  data() {
    return {
      cat: {},
      items: [],
      search: '',
      user: '',
      cloneList: '',
      category: ['ALL', 'VIEW_A', 'VIEW_C'],
      userAndCategory: [],
    };
  },

  watch: {
    search(value) {
      if (!value) {
        return;
      }
      debounce(this.getUsers, 900)(value, this);
    },
    user(value) {
      if (!value) {
        return;
      }
      this.cloneList = value;
      // this.user = [];
    },
  },

  mounted() {
    this.getUsers();
  },
  methods: {
    addToList(input) {
      console.log(input);
      // const userClone = { ...this.user };

      this.userAndCategory.push({
        userId: input,
        category: this.cat[input],
      });
    },
    getUsers() {
      this.$store
        .dispatch('user/list/listUser', {
          lastSeen: undefined,
          limit: 20,
          filter: {
            like_username: this.search,
          },
        })
        .then((data) => {
          this.items = data.docs;
        })
        .catch((e) => {
          console.log(e, '000000');
        });
    },
  },
};
</script>
