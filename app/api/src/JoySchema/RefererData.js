const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: languageCode } = require('../Schema/LanguageCodes');
/**
 * BASE RefererData schema
 */

const base = Joi.object().keys({
  publicToken: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),

  lang: Joi.string()
    .optional()
    .valid(...languageCode)
    .messages({
      'any.only': errorConstMerge.INVALID_LANG,
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

  refererType: Joi.string()
    .valid('SessionReferer', 'PageViewReferer')
    .optional()
    .messages({
      'any.only': errorConstMerge.INVALID_REFERER_TYPE,
    }),
});

const RefererDataSchema = () => base;

module.exports = {
  RefererDataSchema,
};
