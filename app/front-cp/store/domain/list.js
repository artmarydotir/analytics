export const actions = {
  // ***************************************
  async adminListDomain({ commit }, input) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
              $lastSeen: Int,
              $limit: Int,
              $filter: JSON
            ) {
            DomainList(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              }
            ) {
              docs { id domain wildcardDomain options projectName }
            }
          }`,
          variables: input,
        },
      );

      const result = data.data.DomainList;

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
      throw new Error('error');
    }
  },
};
