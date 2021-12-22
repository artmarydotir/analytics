const constants = {
  ACTIVE: 1,
  DELETED: 2,
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'UptimeStatus',
  title: 'Uptime Status',
  description: 'Possible values for Uptime Status',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
