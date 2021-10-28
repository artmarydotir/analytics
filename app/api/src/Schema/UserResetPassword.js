/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'UserResetPassword',
  title: 'User Reset Password',
  description: 'Reset Password',
  type: 'object',
  properties: {
    token: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
};

module.exports = {
  schema,
};
