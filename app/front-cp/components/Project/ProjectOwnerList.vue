<template>
  <div>
    <Snackbar />

    <v-card :elevation="$vuetify.theme.dark ? 9 : 8">
      <v-card-title class="pa-4">
        {{ $t(generalAction.title) }}
        <v-divider vertical class="mr-3 ml-3"></v-divider>
        <v-spacer />
      </v-card-title>
      <v-data-table
        single-select
        item-key="id"
        mobile-breakpoint="960"
        class="pt-2 pb-2"
        hide-default-footer
        :headers="headers"
        :items="projectDocs"
        fixed-header
        :server-items-length="totalServerItem"
      >
        <template v-slot:[`body.prepend`]>
          <TableFilter :filtertype="headers" @sendReadyFilter="readyFilters" />
        </template>

        <template v-slot:[`item.members`]="{ item }">
          <v-chip
            v-for="member in item.members"
            :key="member.id"
            dark
            small
            label
            outlined
            class="ma-1"
            color="purple"
          >
            {{ member.username }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div v-if="item.rules.includes('PROJECTADMIN')">
            <nuxt-link
              :to="localePath({ path: `/project/management/${item.id}` })"
              link
            >
              <v-icon text class="mr-1 ml-1"> mdi-pencil </v-icon>
            </nuxt-link>
          </div>
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

export default {
  name: 'ProjectOwnerList',
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
    mainIcon: {
      required: true,
      type: String,
      default: 'mdi-account-circle',
    },
  },
  data() {
    return {
      projectDocs: [],
      limit: 10,
      loading: false,
      filter: {},
      isDisabledMore: false,
      allUsers: [],
    };
  },
  computed: {
    lastSeen() {
      const lastItem = this.projectDocs[this.projectDocs.length - 1];
      return lastItem ? lastItem.id : undefined;
    },
    totalServerItem() {
      return this.projectDocs.length;
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
        this.projectDocs = searchResult;
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
      this.projectDocs = data;
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

      this.projectDocs.push(...newDocs);
    },

    readyFilters(value) {
      this.filter = value;
    },
  },
};
</script>
