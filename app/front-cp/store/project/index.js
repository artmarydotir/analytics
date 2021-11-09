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
            $title: String!
            $description: String
            $userAndCategory: [JSONObject]!
            $options: [Int]
              ) {
              ProjectCreate(
                data: {
                  title: $title
                  description: $description
                  userAndCategory: $userAndCategory
                  options: $options
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

  // ***************************************

  // ***************************************
};
