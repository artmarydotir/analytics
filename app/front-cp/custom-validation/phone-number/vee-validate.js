import { extend } from 'vee-validate';

import validator from './validate';

extend('phoneNumber', {
  params: ['country', 'types'],
  validate(value, { country, types }) {
    return validator(
      value,
      country,
      types
        .trim()
        .split(',')
        .map((t) => t.trim()),
    );
  },
});
