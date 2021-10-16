const constants = {
  AUTH_PASSWORD: 'AP',
  AUTH_OTP: 'AO',
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'UserAuthType',
  title: 'User Auth Type',
  description: 'Possible values for authentication type',
  type: 'string',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
