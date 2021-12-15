<template>
  <div class="mx-auto">
    <Snackbar />
    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="secondary white--text pa-4">
        {{ $t('editAcl') }}
        <v-spacer></v-spacer>
      </v-card-title>
      <div class="pa-6">
        <ValidationObserver ref="obs">
          <v-form
            novalidate="true"
            :disabled="isDisabled"
            @submit.prevent="onSubmit"
          >
            <v-row>
              <v-col cols="12">
                <v-toolbar dark color="teal">
                  <v-toolbar-title
                    v-show="$vuetify.breakpoint.mdAndUp"
                    class="mr-3 ml-2"
                  >
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
              </v-col>

              <v-col cols="12">
                <v-row v-for="(item, i) in loopingList" :key="i" align="center">
                  <v-col cols="12" md="2">
                    <div>
                      <v-btn fab depressed color="grey" dark small>
                        {{ i + 1 }}
                      </v-btn>
                      <span class="pr-2 pl-2 font-weight-bold">
                        {{ item.username }} :
                        <span v-show="item.id === currentUserId">
                          ({{ $t('you') }})
                        </span>
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
                        :disabled="item.id === currentUserId"
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
                      :disabled="item.id === currentUserId"
                      @click="removeUser(item.id)"
                    >
                      <v-icon dark> mdi-delete </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>
              <!-- actions -->
              <v-col
                cols="12"
                :class="
                  $vuetify.breakpoint.smAndUp
                    ? 'd-flex justify-end align-end'
                    : ''
                "
              >
                <v-btn
                  :disabled="isDisabled"
                  type="submit"
                  x-large
                  color="primary white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                >
                  {{ $t('save') }}
                </v-btn>
                <v-btn
                  x-large
                  color="middle white--text"
                  class="mb-3 mr-1 ml-1 pl-12 pr-12"
                >
                  {{ $t('reset') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </div>
    </v-card>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
const { to } = require('await-to-js');

export default {
  props: {
    edit: {
      type: Boolean,
      default: true,
    },
    project: {
      type: Object,
      default: () => ({}),
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
      currentUserId: Number(this.$store.state.user.auth.userData.id),
      isDisabled: false,
      prepared: [],
    };
  },

  watch: {
    loopingListO(value) {
      // if (this.edit) {
      this.editMutating();
      // }
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
    // if (this.edit) {
    this.editMutating();
    // }
  },
  methods: {
    makeAlist(input) {
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

      this.$set(this, 'prepared', this.delivers);
    },
    getUsers() {
      this.$store
        .dispatch('user/list/listUserClient', {
          projectId: this.project.id,
          lastSeen: undefined,
          limit: 20,
          filter: {
            arrIn_options: [1],
            eq_role: 'CL',
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

    async onSubmit() {
      const validity = await this.$refs.obs.validate();

      if (!validity) {
        return;
      }

      if (this.prepared && this.prepared.length > 0) {
        const info = {
          projectId: this.project.id,
          userAndRules: this.prepared,
        };
        const [, data] = await to(
          this.$store.dispatch('project/addUserRulesByClient', info),
        );
        if (data) {
          this.redirecting();
        } else {
          this.errorCallback();
        }
      }
    },
    redirecting() {
      this.isDisabled = true;
      setTimeout(() => {
        this.$router.push(
          this.localeRoute({
            name: 'project-list',
          }),
        );
      }, 1100);
    },

    errorCallback() {
      this.isDisabled = false;
      setTimeout(() => {
        this.$store.commit('CLOSE_NOTIFICATION', false);
      }, 1000);
    },
  },
};
</script>
