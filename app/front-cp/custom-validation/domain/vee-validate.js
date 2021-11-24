import { extend } from 'vee-validate';
const isValidDomain = require('is-valid-domain');

extend('isDomain', {
  params: ['subdomain', 'wildcard', 'allowUnicode', 'topLevel'],
  validate(value) {
    console.log(value);

    const result = isValidDomain(value, {
      subdomain: true,
      wildcard: true,
      allowUnicode: true,
      topLevel: true,
    });
    return result;
  },
});
