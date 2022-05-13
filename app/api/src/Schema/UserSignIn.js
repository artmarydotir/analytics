/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'UserSignIn',
  title: 'User Sign In',
  description: 'Sign in user data',
  type: 'object',
  properties: {
    remember: {
      type: 'boolean',
      default: false,
    },
    type: {
      type: 'string',
    },
    data: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'name@domain.tld',
        },
        password: {
          type: 'string',
          example: 'samplePassW00rd',
        },
        otp: {
          type: 'string',
        },
        captcha: {
          require: false,
          type: ['object', 'null'],
          properties: {
            id: {
              type: 'string',
            },
            value: {
              type: 'number',
            },
          },
        },
      },
    },
  },
  if: {
    properties: {
      type: { const: 'AP' },
    },
    required: ['type', 'email', 'password', 'captcha'],
  },
  then: { required: ['type', 'email', 'otp'] },
};

module.exports = {
  schema,
};
