export default function ({ store, redirect, route, error }) {
  console.log('before every route => check-token.js');
  store.dispatch('user/auth/refreshToken');
}
