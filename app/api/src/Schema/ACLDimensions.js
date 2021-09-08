const list = ['lang', 'category'];

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'ACLDimensions',
  title: 'Access Control List Dimensions',
  description: 'List of possible action control list dimensions',
  type: 'string',
  enum: list,
};

module.exports = {
  list,
  schema,
};
