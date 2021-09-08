const constants = {
  // gender
  GENDER_MALE: 1,
  GENDER_FEMALE: 2,

  // verification (10-99)
  VERIFIED_BY_ADMIN: 10,
  VERIFIED_EMAIL: 15,
  VERIFIED_MOBILE: 20,
};

const list = Object.values(constants);

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'UserStatus',
  title: 'User Status',
  description: 'Possible values for user status',
  type: 'number',
  enum: list,
};

module.exports = {
  constants,
  list,
  schema,
};
