<template>
  <v-list class="mt-2" dense nav>
    <!-- simple  -->
    <template v-if="simpleItems">
      <v-list-item
        v-for="item in simpleItems"
        :key="item.title"
        :to="localePath(item.link)"
        router
        :color="$vuetify.theme.dark ? 'blue lighten-2' : 'primary'"
      >
        <v-list-item-icon>
          <v-icon>{{ item.action }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> {{ item.title }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <!-- multiple 1  -->
    <v-list-group
      v-for="item in groupItems"
      :key="item.title"
      v-model="item.active"
      class="mt-3 mb-3"
      :prepend-icon="item.action"
      no-action
      :color="$vuetify.theme.dark ? 'blue lighten-2' : 'primary'"
    >
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title
            :class="item.link === $route.path ? 'highlighted' : ''"
            v-text="item.title"
          ></v-list-item-title>
        </v-list-item-content>
      </template>
      <v-divider></v-divider>

      <v-list-item
        v-for="subItem in item.items"
        v-show="subItem.canSee"
        :key="subItem.title"
        :to="localePath(subItem.link)"
        active-class="green--text"
        class="pl-4 mt-1 mb-1"
      >
        <v-list-item-icon>
          <v-icon> mdi-circle-medium </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ subItem.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      currentUserRole: this.$store.getters['user/auth/GET_ROLE'],
    };
  },
  computed: {
    simpleItems() {
      return [
        {
          title: this.$t('dashboard'),
          action: 'mdi-view-dashboard',
          link: '/dashboard',
        },
      ];
    },
    groupItems() {
      return [
        {
          action: 'mdi-monitor-eye',
          title: this.$t('uptimeManagement'),
          active: this.$route.path.includes('uptime'),
          items: [
            {
              title: this.$t('uptimeAdd'),
              link: '/uptime/add/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
            {
              title: this.$t('uptimeList'),
              link: '/uptime/list/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
          ],
        },
        {
          action: 'mdi-finance',
          title: this.$t('performanceManagement'),
          active: this.$route.path.includes('performance'),
          items: [
            {
              title: this.$t('performanceAdd'),
              link: '/performance/add/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
            {
              title: this.$t('performanceList'),
              link: '/performance/list/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
          ],
        },
        {
          action: 'mdi-domain',
          title: this.$t('domainManagement'),
          active: this.$route.path.includes('domain'),
          items: [
            {
              title: this.$t('domainAdd'),
              link: '/domain/add/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
            {
              title: this.$t('domainList'),
              link: '/domain/list/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
          ],
        },
        {
          action: 'mdi-file-table-box-outline',
          title: this.$t('projectManagement'),
          active: this.$route.path.includes('project'),
          items: [
            {
              title: this.$t('projectAdd'),
              link: '/project/add/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
            {
              title: this.$t('projectList'),
              link: '/project/list/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD', 'CL']),
            },
          ],
        },
        {
          action: 'mdi-account',
          title: this.$t('userManagement'),
          active: this.$route.path.includes('user'),
          items: [
            {
              title: this.$t('userAdd'),
              link: '/user/add/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
            {
              title: this.$t('userList'),
              link: '/user/list/',
              canSee: this.canSeeItem(this.currentUserRole, ['SA', 'AD']),
            },
          ],
        },
      ];
    },
  },
  methods: {
    canSeeItem(accessRole, orRoles = []) {
      if (!accessRole) return false;

      let access = false;

      if (orRoles.length > 0) {
        access = false;
        for (let i = 0; i < orRoles.length; i += 1) {
          const role = orRoles[`${i}`];
          if (accessRole === role) {
            access = true;
            break;
          }
        }
      }
      return access;
    },
  },
};
</script>
