const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const { constants: uptimeOption } = require('../../Schema/UptimeOption');

const { CreateUptimeSchema } = require('../../JoySchema/Uptime');
const SequelizeErrorHandler = require('../../Utils/SequelizeErrorHandler');

class UptimeCreate {
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
   * @param {Boolean} data.ping
   */
  async addUptime(data) {
    const {
      name,
      url,
      description,
      interval,
      options = [uptimeOption.ACTIVE],
      ping,
    } = data;

    const schema = CreateUptimeSchema();

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
      ping: typeof ping === 'boolean' ? ping : false,
      interval,
      options: null,
    };

    if (options.length > 0) {
      initialValues.options = options;
    }

    /**
     ***
     *** INSERT ***
     ***
     */
    const { Uptime } = this.sequelize.models;
    let result;

    try {
      result = await Uptime.create(initialValues);
    } catch (e) {
      SequelizeErrorHandler(e);
    }

    return result;
  }
}

module.exports = UptimeCreate;
