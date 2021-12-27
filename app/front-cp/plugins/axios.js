export default function ({ $axios, store }) {
  // if response status is 405, please call refresh token first
  $axios.onResponse((config) => {
    console.log('onResponse =>', config);
    if (config.status === 405) {
      store.dispatch('user/auth/refreshToken');
    }
  });

  // $axios.interceptors.response.use(
  //   (config) => {
  //     // intercept the response and do something when it is received
  //     console.log('Response received');
  //     return config;
  //   },
  //   (error) => {
  //     console.log('first see error', error);
  //     store.dispatch('user/auth/refreshToken');
  //     return Promise.reject(error);
  //   },
  // );
  // $axios.interceptors.response.use(
  //   (response) => {
  //     console.log('Response received');
  //     return response;
  //   },
  //   (error) => {
  //     console.log('loggg', error);
  //     // eslint-disable-next-line eqeqeq
  //     if (error.response.status == 403) {
  //       console.log('first see error', error);
  //       // store.dispatch('user/auth/refreshToken');
  //     }
  //   },
  // );
}
