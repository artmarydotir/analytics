import { extend } from 'vee-validate';
import validator from './validate';

// =========== password meter ===========>
extend('passmeter', {
  validate(value) {
    if (validator(value).strength === 100) {
      return true;
    }
  },
});

// =========== confirm password =========>
extend('passwordcnf', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
});
