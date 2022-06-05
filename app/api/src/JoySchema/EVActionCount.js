const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

/**
 * BASE Event Action Count schema
 */

const base = Joi.object().keys({
  publicToken: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  category: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  startDate: Joi.string().optional().messages({
    'any.only': errorConstMerge.INVALID_DATE,
  }),

  endDate: Joi.string().optional().messages({
    'any.only': errorConstMerge.INVALID_DATE,
  }),

  limit: Joi.number().optional().messages({
    'any.only': errorConstMerge.INVALID_NUMBER,
  }),
});

const EVActionCountSchema = () => base;

module.exports = {
  EVActionCountSchema,
};
