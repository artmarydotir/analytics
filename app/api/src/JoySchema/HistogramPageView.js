const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
const { list: languageCode } = require('../Schema/LanguageCodes');
/**
 * BASE Histogram PageView schema
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

  types: Joi.array()
    .items(
      Joi.string().valid('Users', 'PageView', 'Sessions').required().messages({
        'any.required': errorConstMerge.ISREQUIRE_FIELD,
        'any.allowOnly': errorConstMerge.ISREQUIRE_FIELD,
      }),
    )
    .min(1)
    .messages({
      'array.min': errorConstMerge.ISREQUIRE_FIELD,
    }),
});

const HistogramPageViewSchema = () => base;

module.exports = {
  HistogramPageViewSchema,
};
