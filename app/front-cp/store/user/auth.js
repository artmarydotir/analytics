export const state = () => ({
  userData: {},
  isLogin: false,
  tokenExp: '',
});

export const mutations = {
  SET_USER_DATA(state, data) {
    state.userData = data;
    localStorage.setItem('tokenExpireDate', new Date(data.expires).toString());
    state.isLogin = true;
  },

  CLEAR_USER_DATA(state) {
    state.userData = {};
    localStorage.removeItem('tokenExpireDate');
    state.isLogin = false;
  },
};

export const getters = {
  GET_ROLE(state) {
    if (state.userData) {
      return state.userData.roles;
    } else {
      return '';
    }
  },
};

export const actions = {
  async signIn({ commit }, user) {
    try {
      const response = await this.$axios.post(
        `${window.applicationBaseURL}api/open-api/user/auth/login`,
        user,
      );
      const { data } = response;

      commit('SET_USER_DATA', data);
      if (response.status === 200) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Welcome',
          },
          { root: true },
        );
      }
      return data;
    } catch (error) {
      const { data } = error.response;
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: error.response.status
            ? `Error ${error.response.status} - ${error.response.statusText}`
            : `${data.message}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
};
