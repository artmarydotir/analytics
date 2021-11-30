export const state = () => ({
  profileData: {},
});

export const mutations = {};

export const getters = {};

export const actions = {
  // ***************************************
  async showDomainProfile({ commit }, domainId) {
    console.log(domainId, 'domainId');
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($id: Int!) {
            DomainProfile(
              data: {
                id: $id
              }
            ) {
              id wildcardDomain domain ProjectId description options
            }
          }`,
          variables: {
            id: domainId,
          },
        },
      );

      const result = data.data.DomainProfile;

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
  async addDomain({ commit }, inputData) {
    console.log(inputData);
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $domain: String
            $wildcardDomain: String
            $projectId: Int!
            $description: String
            $options: [Int]!
            $additional: [JSONObject]
              ) {
              DomainCreate(
                data: {
                  domain: $domain
                  wildcardDomain: $wildcardDomain
                  projectId: $projectId
                  description: $description
                  options: $options
                  additional: $additional
                }
              )
          }`,
          variables: inputData,
        },
      );

      const result = data.data.DomainCreate;
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
  async updateDomain({ commit }, inputData) {
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
  async deleteDomain({ commit }, id) {
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

      console.log(data);
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
};
