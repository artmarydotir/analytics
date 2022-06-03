/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'HistogramPageView',
  title: 'Histogram PageView Data',
  description: 'Get HistogramPageView Data',
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
