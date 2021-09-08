const constants = {
  ADMINISTRATOR: 'A',
  MODERATOR: 'M',
  REGISTERED: 'R',
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'UserRoles',
  title: 'User Roles',
  description: 'Possible values for user roles',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
