import { extend } from 'vee-validate';
const isValidDomain = require('is-valid-domain');

extend('isDomain', {
  params: ['wild'],
  validate(value, { wild }) {
    let result = false;
    if (!value) {
      result = false;
    }
    if (wild && !value.startsWith('*.')) {
      result = false;
      return result;
    }

    result = isValidDomain(value, {
      subdomain: true,
      wildcard: wild,
      allowUnicode: true,
    });
    return result;
  },
});
