const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const {
  constants: performanceOption,
} = require('../../Schema/PerformanceOption');

const { CreatePerformanceSchema } = require('../../JoySchema/Performance');
const SequelizeErrorHandler = require('../../Utils/SequelizeErrorHandler');

class PerformanceCreate {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   * @param {Object} data
   * @param {String} data.name
   * @param {String} data.url
   * @param {String} data.description
   * @param {Number} data.interval
   * @param {Number[]} data.options
   */
  async addPerformance(data) {
    const {
      name,
      url,
      description,
      interval,
      options = [performanceOption.ACTIVE],
    } = data;

    const schema = CreatePerformanceSchema();

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
      name: name.toLowerCase(),
      url,
      description: description || null,
      interval,
      options,
    };

    const urlObject = new URL(url);
    initialValues.url = urlObject.origin;

    /**
     ***
     *** INSERT ***
     ***
     */
    const { Performance } = this.sequelize.models;
    let result;

    try {
      result = await Performance.create(initialValues);
    } catch (e) {
      SequelizeErrorHandler(e);
    }

    return result;
  }
}

module.exports = PerformanceCreate;
