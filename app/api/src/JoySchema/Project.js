const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

const CreateProjectSchema = () =>
  Joi.object({
    title: Joi.string()
      .required()
      .max(50)
      // eslint-disable-next-line security/detect-unsafe-regex
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
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
    options: Joi.any().allow(null).optional(),
    additional: Joi.object().allow(null).optional(),
  });

module.exports = {
  CreateProjectSchema,
};
