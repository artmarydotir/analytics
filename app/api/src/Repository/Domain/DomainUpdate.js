const validator = require('validator').default;
const isValidHostname = require('is-valid-hostname');
const { uniq } = require('lodash');
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const {
  CreateDomainSchema: domainJoiSchema,
} = require('../../JoySchema/Domain');

const { constants: domainOption } = require('../../Schema/DomainOption');
const SequelizeErrorHandler = require('../../Utils/SequelizeErrorHandler');

class DomainUpdate {
  constructor({ sequelize, DomainCreateRepository }) {
    this.sequelize = sequelize;
    this.domainFunctions = DomainCreateRepository;
  }

  /**
   *
   * @param {*} id
   * @param {Object} data
   * @param {String} data.domain
   * @param {String} data.wildcardDomain
   * @param {String} data.projectId
   * @param {String} data.description
   * @param {Object.<string, boolean>} data.options
   * @param {Object} data.additional
   * @returns {Promise<object>}
   */

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async updateDomain(id, data) {
    const {
      domain,
      wildcardDomain,
      projectId,
      description,
      options,
      additional = {},
    } = data;

    const schema = domainJoiSchema();

    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

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

    const initialValues = {};

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
      initialValues.wildcardDomain = null;
    }

    if (wildcardDomain) {
      const isValid =
        this.domainFunctions.isValidWildcardDomain(wildcardDomain);

      if (isValid) {
        initialValues.wildcardDomain = wildcardDomain;
        initialValues.domain = null;
      } else {
        throw new ErrorWithProps(errorConstMerge.INVALID_WILDCARD_DOMAIN, {
          statusCode: 400,
        });
      }
    }

    if (description) {
      initialValues.description = description;
    }
    if (options) {
      const newOption = await this.retrieveDomainOptions(id, options);
      initialValues.options = newOption;
    }
    if (additional) {
      initialValues.additional = additional;
    }

    initialValues.ProjectId = projectId;

    /**
     ***
     *** UPDATE ***
     ***
     */
    const { Domain } = this.sequelize.models;

    const affectedRow = await Domain.update(initialValues, {
      where: {
        id,
      },
    });

    return { affectedRow, id };
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async retrieveDomainOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { Domain } = this.sequelize.models;
    const domain = await Domain.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = domain.dataValues.options;

    Object.keys(props).forEach((name) => {
      const booleanStatus = props[`${name}`];
      const value = domainOption[`${name}`];
      if (booleanStatus) {
        newOption.push(value);
      } else {
        newOption = newOption.filter((v) => v !== value);
      }
    });

    newOption = uniq(newOption);

    return newOption;
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async patchDomainOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { Domain } = this.sequelize.models;
    const domain = await Domain.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    if (!domain) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    let newOption = domain.dataValues.options;

    // eslint-disable-next-line sonarjs/no-identical-functions
    Object.keys(props).forEach((name) => {
      const booleanStatus = props[`${name}`];
      const value = domainOption[`${name}`];
      if (booleanStatus) {
        newOption.push(value);
      } else {
        newOption = newOption.filter((v) => v !== value);
      }
    });

    newOption = uniq(newOption);

    try {
      const affectedRow = await Domain.update(
        {
          options: newOption,
        },
        {
          where: {
            id,
          },
        },
      );
      return { affectedRow, id };
    } catch (e) {
      SequelizeErrorHandler(e);
    }
  }
}

module.exports = DomainUpdate;
