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
      // loginRole: this.$store.getters['user/auth/GET_ROLE'],
      simpleItems: [
        {
          title: this.$t('dashboard'),
          action: 'mdi-view-dashboard',
          link: '/dashboard',
        },
      ],
      groupItems: [
        {
          action: 'mdi-cube-outline',
          title: this.$t('nodeManagement'),
          active: this.$route.path.includes('node'),
          items: [
            {
              title: this.$t('nodeAdd'),
              link: '/node/add/',
              // canSee:
              //   !!this.$store.getters['user/auth/GET_ROLE'].includes('SA'),
            },
            {
              title: this.$t('nodeList'),
              link: '/node/list/',
              canSee: true,
            },
          ],
        },
        {
          action: 'mdi-toolbox-outline',
          title: this.$t('certificateManagement'),
          active: this.$route.path.includes('certificate'),
          items: [
            {
              title: this.$t('certificateAdd'),
              link: '/certificate/add/',
              // canSee:
              //   !!this.$store.getters['user/auth/GET_ROLE'].includes('SA'),
            },
            {
              title: this.$t('certificateList'),
              link: '/certificate/list/',
              canSee: true,
            },
          ],
        },

        {
          action: 'mdi-lock',
          title: this.$t('protectionManagement'),
          active: this.$route.path.includes('protection'),
          items: [
            {
              title: this.$t('protectionAdd'),
              link: '/protection/add/',
              // canSee:
              //   !!this.$store.getters['user/auth/GET_ROLE'].includes('SA'),
            },
            {
              title: this.$t('protectionList'),
              link: '/protection/list/',
              canSee: true,
            },
          ],
        },
        {
          action: 'mdi-shield-key-outline',
          title: this.$t('wafManagement'),
          active: this.$route.path.includes('waf'),
          items: [
            {
              title: this.$t('wafAdd'),
              link: '/waf/add/',
              // canSee:
              //   !!this.$store.getters['user/auth/GET_ROLE'].includes('SA'),
            },
            {
              title: this.$t('wafList'),
              link: '/waf/list/',
              canSee: true,
            },
          ],
        },
        {
          action: 'mdi-timelapse',
          title: this.$t('aclManagement'),
          active: this.$route.path.includes('acl'),
          items: [
            {
              title: this.$t('aclAdd'),
              link: '/acl/add/',
              // canSee:
              //   !!this.$store.getters['user/auth/GET_ROLE'].includes('SA'),
            },
            {
              title: this.$t('aclList'),
              link: '/acl/list/',
              canSee: true,
            },
          ],
        },
        {
          action: 'mdi-server-security',
          title: this.$t('upstreamManagement'),
          active: this.$route.path.includes('upstream'),
          items: [
            {
              title: this.$t('upstreamAdd'),
              link: '/upstream/add/',
              // canSee:
              //   !!this.$store.getters['user/auth/GET_ROLE'].includes('SA'),
            },
            {
              title: this.$t('upstreamList'),
              link: '/upstream/list/',
              canSee: true,
            },
          ],
        },
        {
          action: 'mdi-server-network',
          title: this.$t('vhManagement'),
          active: this.$route.path.includes('virtualhost'),
          items: [
            {
              title: this.$t('vhAdd'),
              link: '/virtualhost/add/',
              // canSee:
              //   !!this.$store.getters['user/auth/GET_ROLE'].includes('SA'),
            },
            {
              title: this.$t('vhList'),
              link: '/virtualhost/list/',
              canSee: true,
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
              // canSee:
              //   !!this.$store.getters['user/auth/GET_ROLE'].includes('SA'),
            },
            {
              title: this.$t('userList'),
              link: '/user/list/',
              canSee: true,
            },
          ],
        },
        {
          action: 'mdi-cog-refresh',
          title: this.$t('setting'),
          active: this.$route.path.includes('setting'),
          items: [
            {
              title: this.$t('generalSetting'),
              link: '/setting/config',
              canSee: true,
            },
            {
              title: this.$t('backupRestore'),
              link: '/setting/backup',
              canSee: true,
            },
          ],
        },
      ],
    };
  },
};
</script>
