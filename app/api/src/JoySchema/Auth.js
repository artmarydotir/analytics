const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list, constants } = require('../Schema/UserAuthType');

const UserAuthSchema = () =>
  Joi.object({
    type: Joi.string()
      .required()
      .valid(...list)
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'any.only': errorConstMerge.INVALID_ROLE,
      }),
    email: Joi.string().required().messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    password: Joi.string()
      .min(7)
      .max(32)
      .when('type', {
        is: Joi.exist().valid(constants.AUTH_PASSWORD),
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'string.min': errorConstMerge.MIN_LENGTH,
        'string.max': errorConstMerge.MAX_LENGTH,
        'string.pattern.base': errorConstMerge.INVALID_PASSWORD,
      }),

    captcha: Joi.object()
      .when('type', {
        is: Joi.exist().valid(constants.AUTH_PASSWORD),
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'any.only': errorConstMerge.INVALID_CAPTCHA,
      }),
    otp: Joi.number().when('type', {
      is: Joi.exist().valid(constants.AUTH_OTP),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  });

module.exports = {
  UserAuthSchema,
};
