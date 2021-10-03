const schema = {
  $id: 'ProjectDomainList',
  title: 'Collector Project domain List',
  description: 'Collector Project domain List',
  type: 'object',

  patternProperties: {
    '^[a-zA-Z0-9]{12}$': {
      type: 'array',
      item: {
        type: 'string',
      },
    },
  },
};

module.exports = {
  schema,
};
