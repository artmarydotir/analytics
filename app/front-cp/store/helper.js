export const state = () => ({
  darkMode: true,
});

export const mutations = {
  SWITCH_DARK(state) {
    state.darkMode = !state.darkMode;
  },
};

export const getters = {};

export const actions = {};
