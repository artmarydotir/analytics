const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: userRoles } = require('../Schema/UserRoles');
const { list: languageCode } = require('../Schema/LanguageCodes');
const { list: countryCode } = require('../Schema/CountryCodes');

const CreateUserSchema = () =>
  Joi.object({
    username: Joi.string()
      .min(3)
      .max(31)
      .pattern(/[a-z][a-z0-9._]{3,31}[a-z0-9]/)
      .required()
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'string.min': errorConstMerge.MIN_LENGTH,
        'string.max': errorConstMerge.MAX_LENGTH,
        'string.pattern.base': errorConstMerge.INVALID_REGEX,
      }),
    email: Joi.string().required().messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    password: Joi.string().required().min(7).max(32).messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
      'string.min': errorConstMerge.MIN_LENGTH,
      'string.max': errorConstMerge.MAX_LENGTH,
      'string.pattern.base': errorConstMerge.INVALID_PASSWORD,
    }),
    role: Joi.string()
      .required()
      .valid(...userRoles)
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'any.only': errorConstMerge.INVALID_ROLE,
      }),
    lang: Joi.string()
      .required()
      .valid(...languageCode)
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'any.only': errorConstMerge.INVALID_LANG,
      }),
    country: Joi.any()
      .valid(...countryCode)
      .when('mobile', {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'any.only': errorConstMerge.INVALID_COUNTRY,
      }),
    mobile: Joi.string().messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    options: Joi.array().allow(null).optional(),
    additional: Joi.object().allow(null).optional(),
  });

module.exports = {
  CreateUserSchema,
};
