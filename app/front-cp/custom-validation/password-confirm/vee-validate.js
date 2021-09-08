import { extend } from 'vee-validate';

extend('passwordConfirm', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
});
