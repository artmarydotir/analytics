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

      if (result) {
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

      if (result) {
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
  async addProject({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $title: String!
            $description: String
            $userAndRules: [JSONObject]!
            $options: [Int]!
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

      if (result) {
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

      if (result) {
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

      if (result) {
        commit(
          'SET_NOTIFICATION',
          {
            show: true,
            color: 'green',
            message: 'GENERATED_PRIVATE_TOKEN',
            status: 'success',
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
          message: data.errors,
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
};
