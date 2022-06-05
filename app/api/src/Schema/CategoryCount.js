/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'CategoryCount',
  title: 'Event Category Count',
  description: 'Get Event Category Count',
  type: 'object',
  properties: {
    limit: {
      type: 'number',
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
