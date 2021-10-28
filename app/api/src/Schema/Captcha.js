/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'Captcha',
  title: 'Captcha',
  description: 'Captcha',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    image: {
      type: 'string',
    },
  },
};

module.exports = {
  schema,
};
