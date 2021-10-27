export const state = () => ({
  userForgotPassId: '',
});

export const mutations = {
  SET_USER_ID(state, id) {
    state.userForgotPassId = id;
  },
};

export const actions = {
  // ***************************************
  async verifyUser({ commit }, inputData) {
    console.log(inputData);
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($email: EmailAddress!) {
            UserForgotPassword(
              data: {
                email: $email
              }
            )
        }`,
          variables: inputData,
        },
      );

      if (data.data) {
        // commit('SET_USER_ID', data.data.UserForgotPassword);
        return data.data.UserForgotPassword;
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
  // ***************************************
  async verifyCode({ commit }, inputData) {
    console.log(inputData);
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($code: String!, $id: String!) {
            VerifyCodeUser(
              data: {
                id: $id,
                code: $code
              }
            )
        }`,
          variables: inputData,
        },
      );

      if (data.data) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Code is right',
          },
          { root: true },
        );
        return data.data.VerifyCodeUser;
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
  // ***************************************
  async resetPassword({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: String!, $rawPassword: String!) {
            ResetPasswordUser(
              data: {
                id: $id,
                rawPassword: $rawPassword
              }
            ){
              username, id
            }
        }`,
          variables: inputData,
        },
      );

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (data.data) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Successfully changed.',
          },
          { root: true },
        );
        if (data.data.ResetPasswordUser.id) {
          commit('SET_USER_FG_ID', data.data.ResetPasswordUser.id);
          return true;
        }
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
