<template>
  <div>
    <Snackbar />

    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="middle white--text pa-4">
        {{ $t(generalAction.title) }}
        <v-spacer />
        <v-btn :to="localePath(`${generalAction.addLink}`)" nuxt color="">
          {{ $t(generalAction.linkTitle) }}
        </v-btn>
      </v-card-title>

      <v-data-table
        single-select
        item-key="id"
        mobile-breakpoint="960"
        class="pt-2 pb-2"
        hide-default-footer
        :headers="headers"
        :items="domainDocs"
        fixed-header
        :server-items-length="totalServerItem"
        @click:row="rowClick"
      >
        <template v-if="generalAction.deletable" v-slot:top>
          <ListDialog
            :dialog.sync="dialog"
            :title="$t('deleteDomain')"
            :okbtn="$t('deleteDomain')"
            :closebtn="$t('nope')"
            :done-event="deleteDomain"
          >
            <template slot="dialogbody">
              <h3 class="headline mx-auto text-center pt-3">
                {{ $t('areYouSureDelete') }}
              </h3>

              <div class="text-center mx-auto pt-5 pb-5">
                <span class="text-h5 primary--text">
                  {{ modalData.domain }}
                  {{ modalData.wildcardDomain }}
                  with id: {{ modalData.id }}
                </span>
              </div>
            </template>
          </ListDialog>
        </template>

        <template v-slot:[`body.prepend`]>
          <TableFilter :filtertype="headers" @sendReadyFilter="readyFilters" />
        </template>

        <template v-slot:[`item.options`]="{ item }">
          <v-chip
            v-if="item.options.includes(1)"
            dark
            small
            label
            outlined
            class="ma-1"
            color="green"
          >
            {{ $t('active') }}
          </v-chip>
          <v-chip
            v-if="item.options.includes(2)"
            dark
            label
            small
            outlined
            class="ma-1"
            color="orange"
          >
            {{ $t('deleted') }}
          </v-chip>
        </template>

        <!-- Action  -->
        <template v-slot:[`item.actions`]="{ item }">
          <nuxt-link
            :to="localePath({ path: `${generalAction.editLink}/${item.id}` })"
            link
          >
            <v-icon text class="mr-1 ml-1"> mdi-pencil </v-icon>
          </nuxt-link>

          <v-icon
            :disabled="item.options.includes(2)"
            tag="button"
            class="mr-1 ml-1"
            color="error"
            @click="deleteActionBtn(item)"
          >
            mdi-delete
          </v-icon>
        </template>

        <template v-slot:no-results>
          {{ $t('noResult') }}
        </template>
        <template v-slot:no-data>
          {{ $t('noResult') }}
        </template>
      </v-data-table>
      <v-divider class="pt-4 mt-6"></v-divider>
      <div class="text-center pt-2 mb-5">
        <div class="text-center pt-2">
          <v-btn
            color="primary"
            class="mb-6"
            :disabled="isDisabledMore"
            @click="fetchMoreItem()"
          >
            load more item

            <v-icon right> mdi-arrow-down </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import tableFunctions from '@/mixin/tableFunctions';
const { to } = require('await-to-js');

export default {
  name: 'DomainTable',
  mixins: [tableFunctions],
  props: {
    generalAction: {
      type: Object,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    moduleInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      domainDocs: [],
      limit: 10,
      modalData: {},
      loading: false,
      filter: {},
      dialog: false,
      isDisabledMore: false,
    };
  },
  computed: {
    lastSeen() {
      const lastItem = this.domainDocs[this.domainDocs.length - 1];
      return lastItem ? lastItem.id : undefined;
    },
    totalServerItem() {
      return this.domainDocs.length;
    },
  },
  watch: {
    filter: {
      deep: true,
      handler: debounce(async function (v) {
        const searchResult = await this.callTableListApi(
          {
            filter: v,
            limit: this.limit,
            lastSeen: undefined,
          },
          this.moduleInfo.url,
        );
        this.domainDocs = searchResult;
      }, 900),
    },
  },
  async mounted() {
    const data = await this.callTableListApi(
      {
        lastSeen: undefined,
        limit: this.limit,
        filter: this.filter,
      },
      this.moduleInfo.url,
    );
    if (data) {
      this.domainDocs = data;
    }
  },
  methods: {
    async fetchMoreItem() {
      this.isDisabledMore = false;
      const newDocs = await this.callTableListApi(
        {
          lastSeen: this.lastSeen,
          limit: this.limit,
          filter: this.filter,
        },
        this.moduleInfo.url,
      );
      if (newDocs.length < this.limit) {
        this.isDisabledMore = true;
      }

      this.domainDocs.push(...newDocs);
    },

    readyFilters(value) {
      this.filter = value;
    },

    deleteActionBtn(data) {
      this.dialog = true;
      this.modalData = Object.assign({}, data);
    },

    async deleteDomain() {
      const { id } = this.modalData;

      const [err, data] = await to(
        this.$store.dispatch(this.moduleInfo.rmUrl, id),
      );
      if (data) {
        this.dialog = false;
        const result = await this.callTableListApi(
          {
            lastSeen: undefined,
            limit: this.limit,
            filter: this.filter,
          },
          this.moduleInfo.url,
        );
        this.domainDocs = result;
      }
      if (err) {
        this.dialog = false;
      }
    },
  },
};
</script>
