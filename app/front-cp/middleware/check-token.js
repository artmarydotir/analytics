export default function ({ store, redirect, route, error }) {
  console.log('before every route => check-token.js');
  store.dispatch('user/auth/refreshToken');
  // if not authenticated redirect to login
  if (!store.getters['user/auth/GET_AUTHENTICATED']) {
    console.log('not authenticated');
    return redirect('/');
  }
}
