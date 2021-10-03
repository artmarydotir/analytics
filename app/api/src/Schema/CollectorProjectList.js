const schema = {
  $id: 'CollectorList',
  title: 'Collector List',
  description: 'Collector Project domain List',
  type: 'object',

  patternProperties: {
    '^': { type: 'array' },
  },
};

module.exports = {
  schema,
};
