export const state = () => ({
  profileData: {},
});

export const mutations = {
  SET_USER_DATA(state, data) {
    state.profileData = data;
  },
};

export const getters = {
  GET_SINGLE_USER: (state) => () => {
    return state.profileData;
  },
};

export const actions = {
  // ***************************************
  async showProfile({ commit }, userId) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: Int!) {
            UserProfile(
              data: {
                id: $id
              }
            ) {
              id username role email options lang mobile country
            }
          }`,
          variables: {
            id: userId,
          },
        },
      );

      const result = data.data.UserProfile;

      if (data.errors) {
        throw data.errors;
      }
      if (result) {
        commit('SET_USER_DATA', result);
        return result;
      }
    } catch (error) {
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: `${error}`,
        },
        { root: true },
      );
      throw error;
    }
  },
};
