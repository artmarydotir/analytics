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
            message: 'WELCOME',
            status: 'success',
          },
          { root: true },
        );
      }
      return data;
    } catch (error) {
      const { data } = error.response;
      console.log(data);
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: data.message,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
  // ******
  async refreshToken({ commit, getters, state }) {
    console.log('refreshToken function');
    let tryCallRefreshToken = true;
    const tokenExpireDate = localStorage.getItem('tokenExpireDate');

    if (tokenExpireDate !== null) {
      console.log('iff, #tokenExpireDate', tokenExpireDate);
      const expirationTime = new Date(tokenExpireDate);

      const recent = new Date();
      // console.log(expirationTime, '1111');
      // console.log(recent, '2222');
      // console.log(expirationTime > recent);
      if (expirationTime > recent) {
        console.log(expirationTime, recent);
        tryCallRefreshToken = false;
      }
    }

    if (tryCallRefreshToken) {
      console.log('refresh token called');
      try {
        const response = await this.$axios.get(
          `${window.applicationBaseURL}api/open-api/user/auth/refresh`,
        );
        const { data } = response;
        commit('SET_USER_DATA', data);
      } catch (error) {
        commit('CLEAR_USER_DATA');
        this.app.router.push('/');
      }
    }
  },
};
