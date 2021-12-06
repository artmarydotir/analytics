<template>
  <v-row justify="center" class="mt-12 pt-4">
    <v-col
      cols="12"
      md="9"
      lg="8"
      :class="$vuetify.theme.dark ? 'elevation-10' : 'elevation-7'"
    >
      <v-row v-if="profile">
        <v-col cols="12" md="5">
          <UserAvatar />
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="7">
          <v-card flat class="mx-auto my-12" max-width="500">
            <v-card-title>
              <v-icon color="primary" large left> mdi-account </v-icon>
              {{ $t('welcome') }} {{ profile.username }}
            </v-card-title>

            <v-card-text>
              <div class="my-8">
                <v-row no-gutters>
                  <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
                    <v-card class="pa-2" outlined tile>
                      {{ $t('email') }} :
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
                    <v-card class="pa-2" outlined tile>
                      {{ profile.email }}
                    </v-card>
                  </v-col>
                  <template v-if="profile.mobile">
                    <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
                      <v-card class="pa-2" outlined tile>
                        {{ $t('mobile') }} :
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
                      <v-card class="pa-2" outlined tile>
                        {{ profile.mobile }}
                      </v-card>
                    </v-col>
                  </template>

                  <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
                    <v-card class="pa-2" outlined tile>
                      {{ $t('status') }} :
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6" class="flex-grow-0 flex-shrink-0">
                    <v-card v-if="profile.options" class="pa-2" outlined tile>
                      <v-chip x-small color="green" dark>
                        {{ calcStatus }}
                      </v-chip>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-text class="d-flex align-center">
              <v-card-title class="pr-0 pl-0">{{ $t('role') }} :</v-card-title>
              <v-chip
                color="primary darken-2 accent-4 ml-3 mr-3"
                dark
                small
                class="mt-1"
              >
                <span v-if="profile.role === 'AD'"> {{ $t('admin') }} </span>
                <span v-if="profile.role === 'CL'"> {{ $t('client') }} </span>
                <span v-if="profile.role === 'SA'">
                  {{ $t('superAdmin') }}
                </span>
              </v-chip>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="deep-purple lighten-2"
                text
                @click="edit(profile.id)"
              >
                Edit profile
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    calcStatus() {
      const optionList = this.profile.options;
      if (optionList.includes(1)) {
        return 'Active';
      }
      return 'Unknown';
    },
  },
  methods: {
    edit(uid) {
      this.$router.push(
        this.localeRoute({
          name: 'user-edit-id',
          params: { id: uid },
        }),
      );
    },
  },
};
</script>
