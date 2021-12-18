<template>
  <v-row>
    <v-toolbar dark color="teal">
      <v-toolbar-title v-show="$vuetify.breakpoint.mdAndUp" class="mr-3 ml-2">
        {{ $t('selectUser') }}
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
        :label="$t('selectUserSearch')"
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
            name="rules"
            rules="required"
          >
            <v-select
              v-model="cat[item.id]"
              :items="rules"
              :label="$t('selectRules')"
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
  props: {
    edit: {
      type: Boolean,
      default: false,
    },

    loopingListO: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      cat: {},
      userDocs: [],
      search: '',
      user: '',
      rules: ['PROJECTADMIN', 'VIEWALL'],
      userAndRules: [],
      loopingList: [],
      delivers: [],
    };
  },

  watch: {
    loopingListO(value) {
      if (this.edit) {
        this.editMutating();
      }
    },

    search(value) {
      if (!value) {
        return;
      }
      debounce(this.getUsers, 900)(value, this);
    },
  },

  mounted() {
    this.getUsers();
    if (this.edit) {
      this.editMutating();
    }
  },
  methods: {
    makeAlist(input) {
      if (this.loopingListO.filter((e) => e.UserId === input.id).length > 0) {
        this.$store.commit('SET_NOTIFICATION', {
          show: true,
          color: 'warning',
          message: 'DUPLICATE_ENTRY',
          status: 'hint',
        });
        return;
      }

      if (input) {
        this.loopingList.push(input);
      }
    },

    sendData() {
      this.userAndRules = [];
      for (const key in this.cat) {
        if (this.cat[key]) {
          this.userAndRules.push({
            UserId: Number(key),
            rules: this.cat[key],
          });
        }
      }

      this.userAndRules.forEach((v) => {
        this.loopingList.forEach((v2) => {
          if (v.UserId === v2.id) {
            v.username = v2.username;
          }
        });
      });

      this.delivers = [...this.userAndRules];
      this.$emit('sendData', this.delivers);
    },
    getUsers() {
      this.$store
        .dispatch('user/list/listUser', {
          lastSeen: undefined,
          limit: 20,
          filter: {
            arrIn_options: [1],
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
      this.loopingList = this.loopingList.filter((item) => item.id !== id);
      this.$delete(this.cat, id);

      this.sendData();
    },
    editMutating() {
      const mutateList = this.loopingListO.map((v) => {
        return {
          id: v.UserId,
          username: v.username,
        };
      });
      this.loopingList = mutateList;
      this.cat = this.loopingListO.reduce((acc, cur) => {
        acc[cur.UserId] = cur.rules;
        return acc;
      }, {});
    },
  },
};
</script>
