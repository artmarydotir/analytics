export const mutations = {
  SET_USER_LANG(state, payload) {
    state.setUserLang = payload
  },
  TOGGLE_DRAWER_STATE(state, data) {
    state.drawerState = data
  },
  SET_DRAWER(state, payload) {
    state.drawer = payload
  },

  SET_NOTIFICATION(state, payload) {
    state.snackbar = payload
  },
  CLOSE_NOTIFICATION(state, payload) {
    state.snackbar.show = payload
  },
}

export const getters = {
  getLanguage: (state) => state.setUserLang,
  drawerState: (state) => state.drawerState,
}

export const state = () => ({
  setUserLang: '',
  drawerState: false,
  snackbar: {
    show: false,
    message: null,
    color: null,
    status: null,
  },
})
