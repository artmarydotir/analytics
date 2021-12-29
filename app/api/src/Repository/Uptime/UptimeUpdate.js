const { uniq } = require('lodash');
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const {
  UpdateUptimeSchema: uptimeJoiSchema,
} = require('../../JoySchema/Uptime');
const SequelizeErrorHandler = require('../../Utils/SequelizeErrorHandler');
const { constants: uptimeOption } = require('../../Schema/UptimeOption');

class UptimeUpdate {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   *
   * @param {*} id
   * @param {*} data
   * @returns
   */
  async updateUptime(id, data) {
    const schema = uptimeJoiSchema();
    const { name, url, description, interval, options, ping } = data;

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

    const initialValues = {
      name,
      url,
      description,
      interval,
      options,
      ping,
    };

    if (options) {
      const newOption = await this.retrieveUptimeOptions(id, options);
      initialValues.options = newOption;
    }
    const urlObject = new URL(url);
    initialValues.url = urlObject.origin;

    /**
     ***
     *** UPDATE ***
     ***
     */
    const { Uptime } = this.sequelize.models;
    let uptime;
    try {
      uptime = await Uptime.update(initialValues, {
        where: {
          id,
        },
      });
    } catch (e) {
      SequelizeErrorHandler(e);
    }

    return { affectedRow: uptime, uptimeId: id };
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async patchUptimeOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { Uptime } = this.sequelize.models;
    const uptime = await Uptime.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = uptime.dataValues.options;

    Object.keys(props).forEach((name) => {
      const booleanStatus = props[`${name}`];
      const value = uptimeOption[`${name}`];
      if (booleanStatus) {
        newOption.push(value);
      } else {
        newOption = newOption.filter((v) => v !== value);
      }
    });

    newOption = uniq(newOption);

    const initialValues = {
      options: newOption,
    };

    /**
     ***
     *** UPDATE ***
     ***
     */

    const affectedRow = await Uptime.update(initialValues, {
      where: {
        id,
      },
    });

    return { affectedRow, uptimeId: id };
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async retrieveUptimeOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { Uptime } = this.sequelize.models;
    const uptime = await Uptime.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = uptime.dataValues.options;

    // eslint-disable-next-line sonarjs/no-identical-functions
    Object.keys(props).forEach((name) => {
      const booleanStatus = props[`${name}`];
      const value = uptimeOption[`${name}`];
      if (booleanStatus) {
        newOption.push(value);
      } else {
        newOption = newOption.filter((v) => v !== value);
      }
    });

    newOption = uniq(newOption);

    return newOption;
  }
}

module.exports = UptimeUpdate;
