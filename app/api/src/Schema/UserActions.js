const constants = {
  // generic
  VIEW: 0,
  ADD: 1,
  EDIT: 2,
  DELETE: 3,
  LIST: 4,

  PUBLISH: 10,
  UN_PUBLISH: 11,

  ARCHIVE: 20,
  UN_ARCHIVE: 21,
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema4} */
const schema = {
  $id: 'UserActions',
  title: 'User actions',
  description: 'Possible list of user actions',
  type: 'number',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
