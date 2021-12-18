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

      if (result) {
        commit('SET_USER_DATA', result);
        return result;
      }
    } catch (error) {
      const { data } = error.response;
      commit(
        'SET_NOTIFICATION',
        {
          show: true,
          color: 'red',
          message: data.errors,
        },
        { root: true },
      );
      throw error;
    }
  },
  // ***************************************
  async addUser({ commit }, inputData) {
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

      if (result.id) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'CREATED',
            status: 'success',
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
          message: data.errors,
        },
        { root: true },
      );

      throw new Error('error');
    }
  },
  // ***************************************
  async updateUser({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
              $id: Int!
              $data: InputUserUpdate
            ) {
              UserUpdate(
                id: $id
                data: $data
              )
          }`,
          variables: inputData,
        },
      );

      const result = data.data.UserUpdate;

      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'EDITED',
            status: 'success',
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
          message: data.errors,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
  // ***************************************
  async updatePasswordUser({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
              $id: Int!,
              $currentPassword: String
              $newPassword: String!
            ) {
            UserUpdatePassword(
              data: {
                id: $id
                currentPassword: $currentPassword
                newPassword: $newPassword
              }
            )
        }`,
          variables: inputData,
        },
      );

      const result = data.data.UserUpdatePassword;

      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'UPDATED',
            status: 'success',
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
          message: data.errors,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },

  // ***************************************
  async deleteUser({ commit }, id) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: Int!) {
              UserDelete(
                data: {
                  id: $id,
                }
              )
          }`,
          variables: {
            id,
          },
        },
      );

      const result = data.data.UserDelete;

      if (result.id) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'DELETED',
            status: 'success',
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
          message: data.errors,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
};
