const constants = {
  ACTIVE: 1,
  DELETED: 2,
};

const list = Object.values(constants);
const names = Object.keys(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'UserStatus',
  title: 'User Status',
  description: 'Possible values for user Status',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  names,
  list,
  schema,
};
