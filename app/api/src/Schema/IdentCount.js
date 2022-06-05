/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'IdentCount',
  title: 'Event Ident Count',
  description: 'Get Event Ident Count',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      require: true,
    },
    category: {
      type: 'string',
      require: true,
    },
    action: {
      type: 'string',
      require: true,
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
