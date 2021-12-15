<template>
  <div class="justify-center mx-auto text-center pt-12 mt-12">
    <v-avatar size="162">
      <img
        alt="Avatar"
        :src="`https://www.gravatar.com/avatar/${hash}?s=250`"
      />
    </v-avatar>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      input: this.email,
      hash: '',
    };
  },
  created() {
    this.getHash();
  },

  methods: {
    async getHash() {
      const { data } = await this.$axios.post(
        `${window.applicationBaseURL}api/graphql/graphql`,
        {
          query: `query ($email: String!) {
            Gravatar(
              data: {
                email: $email
              }
            )
          }`,
          variables: {
            email: this.input,
          },
        },
      );

      const result = data.data.Gravatar;
      if (result) {
        this.hash = result;
      }
      if (data.errors) {
        throw data.errors;
      }
    },
  },
};
</script>
