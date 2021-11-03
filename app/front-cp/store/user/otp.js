export const actions = {
  // ***************************************
  async otpGenerate({ commit }, userData) {
    console.log(userData);
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: Int!, $currentPassword : String ) {
            OtpGenerate(
              data: {
                id: $id
                currentPassword: $currentPassword
              }
            )
          }`,
          variables: userData,
        },
      );

      const result = data.data.OtpGenerate;
      console.log(result);
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result !== null) {
        return result;
      }
    } catch (error) {
      const { data } = error.response;

      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: data.errors['0']
            ? `${data.errors['0'].message}`
            : `Error Accrued`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
};
