import { extend } from 'vee-validate';

extend('objectRequired', {
  validate(value) {
    let result = false;

    if (value.id === 0 || value.username === undefined) {
      result = false;
      return;
    } else {
      result = true;
    }

    return result;
  },
});

extend('requiredProject', {
  validate(value) {
    let result = false;

    if (value.id === 0 || value.title === undefined) {
      result = false;
      return;
    } else {
      result = true;
    }

    return result;
  },
});
