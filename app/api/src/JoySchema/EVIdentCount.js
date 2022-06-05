const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

/**
 * BASE Event Ident Count schema
 */

const base = Joi.object().keys({
  publicToken: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  id: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  category: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  action: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  startDate: Joi.string().optional().messages({
    'any.only': errorConstMerge.INVALID_DATE,
  }),

  endDate: Joi.string().optional().messages({
    'any.only': errorConstMerge.INVALID_DATE,
  }),
});

const EVIdentCountSchema = () => base;

module.exports = {
  EVIdentCountSchema,
};
