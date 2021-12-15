export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async listUser({ commit }, input) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
              $lastSeen: Int,
              $limit: Int,
              $filter: JSON
            ) {
            UserList(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              }
            ) {
              docs { id mobile username email role  options }
            }
          }`,
          variables: input,
        },
      );

      const result = data.data.UserList;

      if (data.errors) {
        throw data.errors;
      }
      if (result) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: `Error ${data.errors['0'].extensions.statusCode} : ${data.errors['0'].message}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
  // UserListForAdminClient
  async listUserClient({ commit }, input) {
    console.log(input);
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
              $projectId: Int!
              $lastSeen: Int,
              $limit: Int,
              $filter: JSON
            ) {
            UserListForAdminClient(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              },
              projectId: $projectId
            ) {
              docs { id username  }
            }
          }`,
          variables: input,
        },
      );

      const result = data.data.UserListForAdminClient;

      if (data.errors) {
        throw data.errors;
      }
      if (result) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: `Error ${data.errors['0'].extensions.statusCode} : ${data.errors['0'].message}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
};
