<template>
  <v-row>
    <v-toolbar dark color="teal">
      <v-toolbar-title v-show="$vuetify.breakpoint.mdAndUp" class="mr-3 ml-2">
        Select User:
      </v-toolbar-title>

      <v-autocomplete
        v-model="user"
        :items="userDocs"
        item-text="username"
        item-value="id"
        autocomplete
        flat
        cache-items
        hide-no-data
        hide-details
        clearable
        return-object
        solo-inverted
        :label="$t('Which user you want to search?')"
        :search-input.sync="search"
        @change="makeAlist"
      >
      </v-autocomplete>
    </v-toolbar>

    <v-col cols="12">
      <v-row v-for="(item, i) in loopingList" :key="i" align="center">
        <v-col cols="12" md="2">
          <div>
            <v-btn fab depressed color="grey" dark small>
              {{ i + 1 }}
            </v-btn>
            <span class="pr-2 pl-2 font-weight-bold">
              {{ item.username }} :
            </span>
          </div>
        </v-col>
        <v-col cols="10" md="8" class="pa-0 pt-5">
          <ValidationProvider
            v-slot:default="{ errors, valid }"
            name="category"
            rules="required"
          >
            <v-select
              v-model="cat[item.id]"
              :items="category"
              :label="$t('selectCategory')"
              outlined
              small-chips
              :error-messages="errors"
              :success="valid"
              deletable-chips
              multiple
              @input="sendData"
            >
            </v-select>
          </ValidationProvider>
        </v-col>
        <v-col cols="2" md="2">
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="error"
            elevation="0"
            @click="removeUser(item.id)"
          >
            <v-icon dark> mdi-delete </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </v-col>
  </v-row>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  data() {
    return {
      cat: {},
      userDocs: [],
      search: '',
      user: '',
      category: ['ALL', 'VIEW_A', 'VIEW_C'],
      userAndCategory: [],
      loopingList: [],
      delivers: [],
    };
  },

  watch: {
    search(value) {
      if (!value) {
        return;
      }
      debounce(this.getUsers, 900)(value, this);
    },
  },

  mounted() {
    this.getUsers();
  },
  methods: {
    makeAlist(input) {
      console.log(input);
      if (this.loopingList.includes(input)) {
        this.$store.commit('SET_NOTIFICATION', {
          show: true,
          color: 'warning',
          message: 'User already added to list',
        });

        return;
      }
      if (input) {
        this.loopingList.push(input);
      }
    },
    sendData() {
      this.userAndCategory = [];
      for (const key in this.cat) {
        if (this.cat[key]) {
          this.userAndCategory.push({
            userId: Number(key),
            category: this.cat[key],
          });
        }
      }
      this.delivers = [...this.userAndCategory];
      this.$emit('sendData', this.delivers);
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
          this.userDocs = data.docs;
        })
        .catch((e) => {
          console.log(e, '000000');
        });
    },
    removeUser(id) {
      console.log(id);

      this.loopingList = this.loopingList.filter((item) => item.id !== id);
      this.$delete(this.cat, id);

      this.sendData();
    },
  },
};
</script>
