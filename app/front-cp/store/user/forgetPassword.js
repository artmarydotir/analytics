export const actions = {
  // ***************************************
  async sendCode({ commit }, inputData) {
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
  async resetPassword({ commit }, inputData) {
    try {
      const response = await this.$axios.post(
        `${window.applicationBaseURL}api/open-api/user/reset-password`,
        inputData,
      );

      if (response.status === 200) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'successfully changed',
          },
          { root: true },
        );
        return response.data;
      }
    } catch (error) {
      const { data } = error.response;
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: error.response.status
            ? `Error ${error.response.status} - ${data.message}`
            : `${data.message}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
};
