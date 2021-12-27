export const actions = {
  // ***************************************
  async uptimeList({ commit }, input) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query (
              $lastSeen: Int,
              $limit: Int,
              $filter: JSON
            ) {
              UptimeList(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              }
            ) {
              docs { id url name ping interval options createdAt }
            }
          }`,
          variables: input,
        },
      );

      const result = data.data.UptimeList;

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
