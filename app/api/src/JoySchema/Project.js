const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

const CreateProjectSchema = () =>
  Joi.object({
    title: Joi.string()
      .min(3)
      .max(40)
      .pattern(/^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/)
      .required()
      .messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'string.min': errorConstMerge.MIN_LENGTH,
        'string.max': errorConstMerge.MAX_LENGTH,
        'string.pattern.base': errorConstMerge.INVALID_REGEX,
      }),
    description: Joi.string().max(200).optional().messages({
      'string.max': errorConstMerge.MAX_LENGTH,
    }),
    publicToken: Joi.string().optional().messages({
      'string.max': errorConstMerge.MAX_LENGTH,
    }),
    userAndRoles: Joi.array().allow(null).optional(),
    options: Joi.array().allow(null).optional(),
    additional: Joi.object().allow(null).optional(),
  });

module.exports = {
  CreateProjectSchema,
};
