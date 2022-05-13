const validator = require('validator').default;
const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: domainOption } = require('../Schema/DomainOption');

// Custom validation
const isDomain = (value, helpers) => {
  let domain = value;
  if (value.startsWith('*.')) {
    domain = value.replace('*.', '');
  }

  if (
    validator.isFQDN(domain, {
      allow_wildcard: true,
    })
  ) {
    return true;
  }

  return helpers.error('string.custom');
};

/**
 * BASE domain schema
 */

const base = Joi.object().keys({
  domain: Joi.string().domain().allow(null, '').optional().messages({
    'string.domain': errorConstMerge.INVALID_DOMAIN,
  }),

  wildcardDomain: Joi.string()
    .custom(isDomain)
    .allow(null, '')
    .optional()
    .messages({
      'string.custom': errorConstMerge.INVALID_WILDCARD_DOMAIN,
    }),

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
