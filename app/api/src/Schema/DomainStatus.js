const constants = {
  ACTIVE: 1,
  DELETED: 2,
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'DomainStatus',
  title: 'Domain Status',
  description: 'Possible values for Domain Status',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
