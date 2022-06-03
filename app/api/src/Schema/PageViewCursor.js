/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'PageViewCursor',
  title: 'PageView Cursor',
  description: 'Get Specific Entity Page View By Cursor',
  type: 'object',
  properties: {
    cursorID: {
      type: 'string',
    },
    entityModule: {
      type: 'string',
      require: true,
    },
  },
};

module.exports = {
  schema,
};
