/* eslint-disable class-methods-use-this */
const validator = require('validator').default;
const isValidHostname = require('is-valid-hostname');

const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const {
  CreateDomainSchema: domainJoiSchema,
} = require('../../JoySchema/Domain');

const SequelizeErrorHandler = require('../../Utils/SequelizeErrorHandler');
const { constants: domainOption } = require('../../Schema/DomainOption');

class DomainCreate {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   *
   * @param {Object} data
   * @param {String} data.domain
   * @param {String} data.wildcardDomain
   * @param {String} data.projectId
   * @param {String} data.description
   * @param {Number[]} data.options
   * @param {Object} data.additional
   * @returns {Promise<object>}
   */

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async addDomain(data) {
    const {
      domain,
      wildcardDomain,
      projectId,
      description,
      options = [domainOption.ACTIVE],
      additional = {},
    } = data;

    const schema = domainJoiSchema();

    try {
      await schema.validateAsync(data, { abortEarly: false });
    } catch (e) {
      const validationErrors = [];
      e.details.forEach((element) => {
        validationErrors.push({
          message: element.message,
          field: element.context.label,
        });
      });

      throw new ErrorWithProps(errorConstMerge.UNPROCESSABLE_ENTITY, {
        validation: validationErrors,
        statusCode: 422,
      });
    }

    const initialValues = {
      domain: null,
      wildcardDomain: null,
      description: null,
      options,
      additional: null,
      ProjectId: null,
      enabled: true,
    };

    if (domain && wildcardDomain) {
      throw new ErrorWithProps(errorConstMerge.NOT_REQUIRED_BOTH, {
        statusCode: 400,
      });
    }

    if (!domain && !wildcardDomain) {
      throw new ErrorWithProps(errorConstMerge.REQUIRED_ONLY, {
        statusCode: 400,
      });
    }

    if (domain) {
      const invalid = validator.isIP(domain, 4) || !isValidHostname(domain);

      if (invalid) {
        throw new ErrorWithProps(errorConstMerge.INVALID_DOMAIN, {
          statusCode: 400,
        });
      }
      initialValues.domain = domain;
    }

    if (wildcardDomain) {
      const isValid = this.isValidWildcardDomain(wildcardDomain);

      if (isValid) {
        initialValues.wildcardDomain = wildcardDomain;
      } else {
        throw new ErrorWithProps(errorConstMerge.INVALID_WILDCARD_DOMAIN, {
          statusCode: 400,
        });
      }
    }

    if (description) {
      initialValues.description = description;
    }

    if (additional) {
      initialValues.additional = additional;
    }

    initialValues.ProjectId = projectId;

    /**
     ***
     *** INSERT ***
     ***
     */
    let result;
    const { Domain } = this.sequelize.models;
    try {
      result = await Domain.create(initialValues);
      return result.dataValues;
    } catch (e) {
      SequelizeErrorHandler(e);
    }

    return result;
  }

  /**
   *
   * @param {*} input
   * @returns {Boolean}
   */
  isValidWildcardDomain(input) {
    let isValid = false;

    if (input.startsWith('*.')) {
      const desiredDomain = input.replace('*.', '');
      isValid = isValidHostname(desiredDomain);
    } else {
      isValid = false;
    }

    return isValid;
  }
}

module.exports = DomainCreate;
