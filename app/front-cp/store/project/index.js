export const state = () => ({
  profileData: {},
});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************

  // ***************************************
  async addProject({ commit }, inputData) {
    console.log(inputData);
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $username: String!
            $email: EmailAddress!
            $password: String!
            $role: String!
            $lang: String
            $country: String
            $mobile: String
            $options: [Int]!
              ) {
              UserCreate(
                data: {
                  username: $username
                  email: $email
                  password: $password
                  lang: $lang
                  country: $country
                  role: $role
                  mobile: $mobile
                  options: $options
                }
              )
          }`,
          variables: inputData,
        },
      );

      const result = data.data.UserCreate;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result.id) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Successfully Created user.',
          },
          { root: true },
        );
        return true;
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
  // ***************************************

  // ***************************************

  // ***************************************
};
