import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
  new VuexPersistence({
    /* your options */
    key: '_persistStates',
    modules: ['user', 'helper', 'index'],
  }).plugin(store);
};
