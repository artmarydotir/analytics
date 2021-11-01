import { extend } from 'vee-validate';
import { mobile } from '../constant';
import validator from './validate';

extend('mobileNumber', {
  params: ['code'],
  validate(value, { code }) {
    console.log(value, code);
    let result;
    if (value.match(mobile)) {
      result = validator(value, code);
      return result;
    }
  },
});
