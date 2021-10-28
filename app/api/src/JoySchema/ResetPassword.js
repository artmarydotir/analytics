const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

/**
 * ResetPassword schema
 */

const ResetPasswordSchema = () =>
  Joi.object({
    token: Joi.string().min(6).max(20).required().messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
      'string.min': errorConstMerge.MIN_LENGTH,
      'string.max': errorConstMerge.MAX_LENGTH,
    }),
    newPassword: Joi.string().required().min(7).max(32).messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
      'string.min': errorConstMerge.MIN_LENGTH,
      'string.max': errorConstMerge.MAX_LENGTH,
      'string.pattern.base': errorConstMerge.INVALID_PASSWORD,
    }),
  });

module.exports = {
  ResetPasswordSchema,
};
