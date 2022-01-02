const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: userRoles } = require('../Schema/UserRoles');
const { list: languageCode } = require('../Schema/LanguageCodes');
const { list: countryCode } = require('../Schema/CountryCodes');
const { list: userOption } = require('../Schema/UserOption');

/**
 * BASE user schema
 */
const base = Joi.object().keys({
  username: Joi.string()
    .min(4)
    .max(32)
    .lowercase()
    .regex(/^(?=[a-z_\d]*[a-z])[a-z_\d]{4,}$/)
    .required()
    .messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
      'string.min': errorConstMerge.MIN_LENGTH,
      'string.max': errorConstMerge.MAX_LENGTH,
      'string.pattern.base': errorConstMerge.INVALID_USERNAME,
    }),
  email: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
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
    .allow(null, '')
    .when('mobile', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    })
    .messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
      'any.only': errorConstMerge.INVALID_COUNTRY,
    }),
  mobile: Joi.string().allow(null, '').optional(),
});

/**
 * Create user schema
 */

const CreateUserSchema = () =>
  base.keys({
    options: Joi.array()
      .items(Joi.number().valid(...userOption))
      .messages({
        'array.items': errorConstMerge.INVALID_OPTION,
      }),
    password: Joi.string().required().min(7).max(32).messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
      'string.min': errorConstMerge.MIN_LENGTH,
      'string.max': errorConstMerge.MAX_LENGTH,
    }),
    role: Joi.string()
      .required()
      .valid(...userRoles)
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'any.only': errorConstMerge.INVALID_ROLE,
      }),
  });

/**
 * Update user schema For Superadmin
 */
const UpdateUserSchemaSA = () =>
  base.keys({
    role: Joi.string()
      .required()
      .valid(...userRoles)
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'any.only': errorConstMerge.INVALID_ROLE,
      }),
    options: Joi.object()
      .keys({
        ACTIVE: Joi.boolean().optional(),
        DELETED: Joi.boolean().optional(),
      })
      .required()
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
      }),
  });

/**
 * Update user schema For Members
 */
const UpdateUserSchemaME = () => base.keys();

/**
 * Update Member Password
 */
const UpdateMemberPassword = () =>
  Joi.object({
    id: Joi.number().required().messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    currentPassword: Joi.string().optional().min(7).max(32).messages({
      'string.min': errorConstMerge.MIN_LENGTH,
      'string.max': errorConstMerge.MAX_LENGTH,
      'string.pattern.base': errorConstMerge.INVALID_PASSWORD,
    }),
    newPassword: Joi.string()
      .required()
      .min(7)
      .max(32)
      .regex(new RegExp('^[a-zA-Z0-9]{7,32}$'))
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'string.min': errorConstMerge.MIN_LENGTH,
        'string.max': errorConstMerge.MAX_LENGTH,
        'string.pattern.base': errorConstMerge.INVALID_PASSWORD,
      }),
  });

module.exports = {
  CreateUserSchema,
  UpdateUserSchemaSA,
  UpdateUserSchemaME,
  UpdateMemberPassword,
};
