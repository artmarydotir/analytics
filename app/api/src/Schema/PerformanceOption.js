const constants = {
  ACTIVE: 1,
  DELETED: 2,
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'PerformanceStatus',
  title: 'Performance Status',
  description: 'Possible values for Performance Status',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
