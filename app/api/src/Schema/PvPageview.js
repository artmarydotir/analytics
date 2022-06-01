/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'PageViewCount',
  title: 'PageView Count',
  description: 'Get users, pageviews, sessions count',
  type: 'object',
  properties: {
    types: {
      type: 'array',
      require: true,
    },
    lang: {
      type: 'string',
      require: false,
    },
    startDate: {
      type: 'string',
      require: false,
    },
    endDate: {
      type: 'string',
      require: false,
    },
  },
};

module.exports = {
  schema,
};
