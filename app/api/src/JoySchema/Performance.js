const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: performanceOption } = require('../Schema/PerformanceOption');

/**
 * BASE performance schema
 */

const base = Joi.object().keys({
  name: Joi.string().min(3).max(40).required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
    'string.min': errorConstMerge.MIN_LENGTH,
    'string.max': errorConstMerge.MAX_LENGTH,
  }),
  url: Joi.string().uri().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
  description: Joi.string().max(200).optional().allow(null, '').messages({
    'string.max': errorConstMerge.MAX_LENGTH,
  }),
  interval: Joi.number().min(2).max(60).required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
    'number.min': errorConstMerge.MIN_LENGTH,
    'number.max': errorConstMerge.MAX_LENGTH,
  }),
});

// Create schema
const CreatePerformanceSchema = () =>
  base.keys({
    options: Joi.array()
      .items(Joi.number().valid(...performanceOption))
      .messages({
        'array.items': errorConstMerge.INVALID_OPTION,
      }),
  });

// Update schema
const UpdatePerformanceSchema = () =>
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
  CreatePerformanceSchema,
  UpdatePerformanceSchema,
};
