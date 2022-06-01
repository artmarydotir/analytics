const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: languageCode } = require('../Schema/LanguageCodes');
/**
 * BASE Top Urls schema
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

  type: Joi.string().valid('CanonicalURL', 'URL').optional().messages({
    'any.only': errorConstMerge.INVALID_URL_TYPE,
  }),
});

const TopUrlsSchema = () => base;

module.exports = {
  TopUrlsSchema,
};
