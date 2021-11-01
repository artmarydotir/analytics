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
  // ***************************************
  async addUser({ commit }, inputData) {
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
};
