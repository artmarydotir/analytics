const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: domainOption } = require('../Schema/DomainOption');

/**
 * BASE domain schema
 */

const base = Joi.object().keys({
  domain: Joi.allow(null).optional(),
  wildcardDomain: Joi.allow(null).optional(),

  projectId: Joi.number().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
  description: Joi.string().max(200).optional().messages({
    'string.max': errorConstMerge.MAX_LENGTH,
  }),
});

// Create schema
const CreateDomainSchema = () =>
  base.keys({
    options: Joi.array()
      .items(Joi.number().valid(...domainOption))
      .messages({
        'array.items': errorConstMerge.INVALID_OPTION,
      }),
  });

// Update schema
const UpdateDomainSchema = () =>
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
  CreateDomainSchema,
  UpdateDomainSchema,
};
