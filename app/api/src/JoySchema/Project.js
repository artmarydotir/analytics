const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: projectOption } = require('../Schema/ProjectOption');

/**
 * BASE project schema
 */

const base = Joi.object().keys({
  title: Joi.string().required().min(3).max(50).messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
    'string.min': errorConstMerge.MIN_LENGTH,
    'string.max': errorConstMerge.MAX_LENGTH,
  }),
  description: Joi.string().max(200).optional().messages({
    'string.max': errorConstMerge.MAX_LENGTH,
    'string.base': errorConstMerge.INVALID_STRING,
  }),

  publicToken: Joi.string().optional().messages({
    'string.base': errorConstMerge.INVALID_STRING,
  }),

  userAndRules: Joi.array().allow(null).optional(),

  primaryOwner: Joi.number().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
});

// Create schema
const CreateProjectSchema = () =>
  base.keys({
    options: Joi.array()
      .items(Joi.number().valid(...projectOption))
      .messages({
        'array.items': errorConstMerge.INVALID_OPTION,
      }),
  });

// Update schema
const UpdateProjectSchema = () =>
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
  CreateProjectSchema,
  UpdateProjectSchema,
};
