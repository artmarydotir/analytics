export const actions = {
  // ***************************************

  // ***************************************
  async addUptime({ commit }, inputData) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation (
            $name: String!
            $url: String!
            $interval: Int!
            $ping: Boolean!
            $description: String
            $options: [Int]!
              ) {
              UptimeCreate(
                data: {
                  name: $name
                  url: $url
                  interval: $interval
                  ping: $ping
                  description: $description
                  options: $options
                }
              )
          }`,
          variables: inputData,
        },
      );

      const result = data.data.UptimeCreate;
      console.log(result);
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
  async deleteUptime({ commit }, id) {
    try {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `mutation ($id: Int!) {
              UptimeDelete(
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

      const result = data.data.UptimeDelete;

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
};
