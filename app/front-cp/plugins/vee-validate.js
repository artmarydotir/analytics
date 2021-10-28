/* eslint-disable camelcase */
import Vue from 'vue';
import '@/custom-validation/validators';
import {
  required,
  email,
  min,
  max,
  length,
  numeric,
  alpha,
  alpha_spaces,
  alpha_dash,
  regex,
  digits,
} from 'vee-validate/dist/rules';

import {
  extend,
  setInteractionMode,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate';

setInteractionMode('eager');

extend('required', required);
extend('email', email);
extend('min', min);
extend('max', max);
extend('length', length);
extend('numeric', numeric);
extend('alpha', alpha);
extend('digits', digits);
extend('alpha_spaces', alpha_spaces);
extend('alpha_dash', alpha_dash);
extend('regex', regex);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
