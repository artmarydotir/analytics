import { extend } from 'vee-validate';

import validator from './validate';

extend('passwordConfirm', {
  validate(value) {
    if (value) {
      return validator(value);
    }
  },
  message: 'Password confirmation failed.',
});
