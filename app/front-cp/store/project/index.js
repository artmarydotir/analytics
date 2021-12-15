export const state = () => ({
  profileData: {},
});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async showProjectProfile({ commit }, { projectId, fields }) {
    const fieldString = fields.join(' ');

    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: Int!) {
            ProjectProfile(
              data: {
                id: $id
              }
            ) {
              ${fieldString}
            }
          }`,
          variables: {
            id: projectId,
          },
        },
      );

      const result = data.data.ProjectProfile;

      if (data.errors) {
        throw data.errors;
      }
      if (result) {
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
  async showPrivateToken({ commit }, input) {
    console.log(input);
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
            $projectId: Int!
            $password: String!
            ) {
            ProjectShowPrivateToken(
              data: {
                projectId: $projectId
                password: $password
              }
            )
          }`,
          variables: input,
        },
      );

      const result = data.data.ProjectShowPrivateToken;

      if (data.errors) {
        throw data.errors;
      }
      if (result) {
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
  async addProject({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $title: String!
            $description: String
            $userAndRules: [JSONObject]!
            $options: [Int]
            $primaryOwner: Int!
              ) {
              ProjectCreate(
                data: {
                  title: $title
                  description: $description
                  userAndRules: $userAndRules
                  options: $options
                  primaryOwner: $primaryOwner
                }
              )
          }`,
          variables: inputData,
        },
      );

      const result = data.data.ProjectCreate;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Successfully Created project.',
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
  async updateProject({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
              $id: Int!
              $data: InputProjectUpdate
            ) {
              ProjectUpdate(
                id: $id
                data: $data
              )
          }`,
          variables: inputData,
        },
      );

      const result = data.data.ProjectUpdate;

      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Successfully Edited Project.',
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
          message: `Error ${data.errors['0'].extensions.statusCode} : ${data.errors['0'].message}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
  // ***************************************
  async deleteProject({ commit }, id) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: Int!) {
            ProjectDelete(
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

      const result = data.data.ProjectDelete;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Successfully Deleted project.',
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
          message: `Error ${data.errors['0'].extensions.statusCode} : ${data.errors['0'].message}`,
        },
        { root: true },
      );
      throw new Error('error');
    }
  },
  // ***************************************
  async generatePrivateToken({ commit }, id) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: Int!) {
            PrivateTokenRegenerate(
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

      const result = data.data.PrivateTokenRegenerate;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Successfully Generate private token.',
          },
          { root: true },
        );
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
  // *****************client*******************
  async addUserRulesByClient({ commit }, inputData) {
    console.log(inputData);
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
              $projectId: Int!
              $userAndRules: [JSONObject]!
                ) {
                ProjectUpdateUserRules(
                  data: {
                    projectId: $projectId
                    userAndRules: $userAndRules
                  }
                )
            }`,
          variables: inputData,
        },
      );

      const result = data.data.ProjectUpdateUserRules;
      if (data.errors) {
        throw new Error(data.errors['0'].message);
      }
      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'Successfully updated project.',
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
