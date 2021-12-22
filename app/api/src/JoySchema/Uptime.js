const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

/**
 * BASE uptime schema
 */

const base = Joi.object().keys({
  name: Joi.string()
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
  url: Joi.string().uri().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
  description: Joi.string().max(200).optional().messages({
    'string.max': errorConstMerge.MAX_LENGTH,
  }),
  interval: Joi.number().min(4).required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
    'number.min': errorConstMerge.MIN_LENGTH,
  }),
  ping: Joi.boolean().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
});

// Create schema
const CreateUptimeSchema = () =>
  base.keys({
    options: Joi.array().items(Joi.number()).required().messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
  });

// Update schema
const UpdateUptimeSchema = () =>
  base.keys({
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

module.exports = {
  CreateUptimeSchema,
  UpdateUptimeSchema,
};
