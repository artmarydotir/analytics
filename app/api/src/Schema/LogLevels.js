const constants = {
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  FATAL: 6,
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'LogLevels',
  title: 'Log levels',
  description: 'Standard levels of log',
  type: 'number',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
