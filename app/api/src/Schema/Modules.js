const { invert } = require('lodash');

const constants = {
  MODULES_GENERAL: 0,
  MODULES_LOG: 1,
  MODULES_USER: 2,
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'Modules',
  title: 'Modules',
  description: 'Possible list of modules',
  type: 'number',
  enum: list,
};

module.exports = {
  invertConstants: invert(constants),
  constants,
  list,
  schema,
};
