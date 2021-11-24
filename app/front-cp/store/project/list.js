export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async adminListProject({ commit }, input) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
              $lastSeen: Int,
              $limit: Int,
              $filter: JSON
            ) {
              ProjectList(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              }
            ) {
              docs { id title owner options publicToken createdAt }
            }
          }`,
          variables: input,
        },
      );

      console.log(data);
      const result = data.data.ProjectList;

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
  // ****************role=viewer***********************
  async viewerListProject({ commit }, input) {
    console.log('-----');
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
              $lastSeen: Int,
              $limit: Int,
              $filter: JSON
            ) {
            ProjectOwnerList(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              }
            ) {
              docs { id title publicToken description }
            }
          }`,
          variables: input,
        },
      );

      console.log(data);
      const result = data.data.ProjectOwnerList;

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
