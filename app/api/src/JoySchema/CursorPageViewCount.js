const Joi = require('joi');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');
/**
 * BASE Cursor PageView Count schema
 */

const base = Joi.object().keys({
  publicToken: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
  entityModule: Joi.string().required().messages({
    'any.required': errorConstMerge.ISREQUIRE_FIELD,
  }),
  cursorID: Joi.string().optional().messages({
    'any.only': errorConstMerge.ISREQUIRE_FIELD,
  }),
});

const BaseCursorPageViewCountSchema = () => base;

module.exports = {
  BaseCursorPageViewCountSchema,
};
