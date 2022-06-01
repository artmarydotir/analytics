/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'RefererData',
  title: 'Referer Data',
  description: 'Get Referer Data',
  type: 'object',
  properties: {
    refererType: {
      type: 'string',
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
    limit: {
      type: 'number',
      require: false,
    },
  },
};

module.exports = {
  schema,
};
