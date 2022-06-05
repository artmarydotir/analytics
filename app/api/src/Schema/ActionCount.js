/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'ActionCount',
  title: 'Event Action Count',
  description: 'Get Event Action Count',
  type: 'object',
  properties: {
    category: {
      type: 'string',
      require: true,
    },
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
