/* eslint-disable class-methods-use-this */
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

    if (wildcardDomain) {
      let wDomain = wildcardDomain;
      if (wildcardDomain.startsWith('*.')) {
        wDomain = wildcardDomain.replace('*.', '');
      }

      initialValues.wildcardDomain = wDomain;
    }

    if (description) {
      initialValues.description = description;
    }
    initialValues.domain = domain;
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
}

module.exports = DomainCreate;
