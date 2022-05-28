const constants = {
  ISREQUIRE_FIELD: '',
  INVALID_EMAIL_FORMAT: '',
  INVALID_USERNAME: '',
  UNAUTHORIZED: '',
  ISREQUIRE_ID: '',
  ISREQUIRE_EMAIL: '',
  NULL_ENTRY: '',
  ISREQUIRE_PASSWORD: '',
  MIN_LENGTH: '',
  MAX_LENGTH: '',
  INVALID_OPTION: '',
  INVALID_REGEX: '',
  INVALID_PASSWORD: '',
  INVALID_ROLE: '',
  INVALID_LANG: '',
  INVALID_COUNTRY: '',
  INVALID_MOBILE: '',
  INVALID_DOMAIN: '',
  NOT_REQUIRED_BOTH: '',
  REQUIRED_ONLY: '',
  INVALID_WILDCARD_DOMAIN: '',
  INVALID_CAPTCHA: '',
  NOT_EXIST: '',
  OTHER_ERROR: '',
  FORBIDDEN: '',
  DUPLICATE_ENTRY: '',
  NOT_ALLOWED: '',
  INVALID_PROJECT_RULE: '',
  UNPROCESSABLE_ENTITY: '',
  INVALID_AUTH_TYPE: '',
  INVALID_STRING: '',
  INVALID_PAIR_KEY: '',
  INVALID_DATE_RANGE: '',
  INVALID_DATE: '',
};

const list = Object.values(constants);

const constantsMerge = {};
Object.keys(constants).forEach((k) => {
  constantsMerge[`${k}`] = k;
});

/** @type {import('json-schema').JSONSchema7} */
const schema = {
  $id: 'ErrorMessage',
  title: 'Error Message',
  description: 'Possible values for error message.',
  type: 'string',
  enum: list,
};

module.exports = {
  constantsMerge,
  constants,
  list,
  schema,
};
