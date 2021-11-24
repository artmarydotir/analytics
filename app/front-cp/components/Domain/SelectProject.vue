<template>
  <v-autocomplete
    v-model="innerValue"
    :items="projectList"
    item-text="title"
    item-value="id"
    autocomplete
    outlined
    :label="$t('selectProject')"
    :search-input.sync="search"
  >
  </v-autocomplete>
</template>

<script>
import debounce from 'lodash/debounce';
const { to } = require('await-to-js');

export default {
  props: {
    model: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      projectList: [],
      search: '',
    };
  },
  computed: {
    innerValue: {
      get() {
        return this.model;
      },
      set(v) {
        this.$emit('update:model', v);
      },
    },
  },
  watch: {
    search(value) {
      debounce(this.callProjectList, 900)(value, this);
    },
  },
  async mounted() {
    await this.callProjectList();
  },
  methods: {
    async callProjectList() {
      const [, data] = await to(
        this.$store.dispatch('project/list/adminListProject', {
          lastSeen: undefined,
          limit: 20,
          filter: {
            like_title: this.search ? this.search : undefined,
          },
        }),
      );

      if (data) {
        this.projectList = data.docs.map((item) => ({
          id: item.id,
          title: item.title,
        }));
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
