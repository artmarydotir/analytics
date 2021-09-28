const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

const CreateDomainSchema = () =>
  Joi.object({
    domain: Joi.allow(null).optional(),
    wildcardDomain: Joi.allow(null).optional(),

    projectId: Joi.number().required().messages({
      'any.required': errorConstMerge.ISREQUIRE_FIELD,
    }),
    description: Joi.string().max(200).optional().messages({
      'string.max': errorConstMerge.MAX_LENGTH,
    }),
    options: Joi.array().allow(null).optional(),
    additional: Joi.object().allow(null).optional(),
  });

module.exports = {
  CreateDomainSchema,
};
