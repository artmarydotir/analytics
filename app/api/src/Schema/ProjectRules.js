const constants = {
  PROJECTADMIN: 'PROJECTADMIN',
  VIEWALL: 'VIEWALL',
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'ProjectRules',
  title: 'Project Rules',
  description: 'Possible values for project rules',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
