const { uniq } = require('lodash');
const validator = require('validator').default;
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { constants: userOption } = require('../../Schema/UserOption');
const {
  UpdateUserSchemaSA: updateJoiSchemaSA,
  UpdateUserSchemaME: updateJoiSchemaME,
} = require('../../JoySchema/User');

class UserUpdate {
  constructor({ sequelize, UserProcessRepository }) {
    this.sequelize = sequelize;
    this.process = UserProcessRepository;
  }

  /**
   * @param {Number} id
   * @param {Object} data
   * @param {String} data.username
   * @param {String} data.email
   * @param {String} data.role
   * @param {String} data.lang
   * @param {Object.<string, boolean>} data.options
   * @param {String} data.country
   * @param {String} data.mobile
   * @param {Object} data.additional
   */

  async updateUserBySuperAdmin(id, data) {
    const {
      username,
      email,
      role,
      lang,
      options,
      country,
      mobile,
      additional,
    } = data;

    const schema = updateJoiSchemaSA();

    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const isUserExist = await this.process.isUserExistByID(id);

    if (isUserExist) {
      await this.validateShema(schema, data);
    }

    const initialValues = {
      username: null,
    };

    initialValues.username = username.toLowerCase();

    if (email && validator.isEmail(email)) {
      initialValues.email = validator.normalizeEmail(email);
    }

    initialValues.role = role;

    initialValues.lang = lang;

    initialValues.country = country;

    if (mobile) {
      const validMobile = this.process.setMobile(mobile, country);
      if (validMobile) {
        initialValues.mobile = validMobile;
      } else {
        throw new ErrorWithProps(errorConstMerge.INVALID_MOBILE, {
          statusCode: 400,
        });
      }
    }

    if (options) {
      const getOptions = await this.retrieveUserOptions(id, options);
      initialValues.options = getOptions;
    }

    if (additional && typeof additional === 'object') {
      initialValues.additional = additional;
    }

    /**
     ***
     *** UPDATE ***
     ***
     */

    const { User } = this.sequelize.models;

    const affectedRow = await User.update(initialValues, {
      where: {
        id,
      },
    });

    return { affectedRow, id };
  }

  /**
   * @param {Number} id
   * @param {Object} data
   * @param {String} data.username
   * @param {String} data.email
   * @param {String} data.lang
   * @param {String} data.country
   * @param {String} data.mobile
   * @param {Object} data.additional
   */
  async updateUserByMembers(id, data) {
    const { username, email, lang, country, mobile, additional } = data;

    const schema = updateJoiSchemaME();

    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const isUserExist = await this.process.isUserExistByID(id);

    if (isUserExist) {
      await this.validateShema(schema, data);
    }

    const initialValues = {
      username: null,
    };

    initialValues.username = username.toLowerCase();

    if (email && validator.isEmail(email)) {
      initialValues.email = validator.normalizeEmail(email);
    }

    initialValues.lang = lang;

    if (country) {
      initialValues.country = country;
    }

    if (mobile) {
      const validMobile = this.process.setMobile(mobile, country);
      if (validMobile) {
        initialValues.mobile = validMobile;
      } else {
        throw new ErrorWithProps(errorConstMerge.INVALID_MOBILE, {
          statusCode: 400,
        });
      }
    }

    if (additional && typeof additional === 'object') {
      initialValues.additional = additional;
    }

    /**
     ***
     *** UPDATE ***
     ***
     */

    const { User } = this.sequelize.models;

    const affectedRow = await User.update(initialValues, {
      where: {
        id,
      },
    });

    return { affectedRow, id };
  }

  // eslint-disable-next-line class-methods-use-this
  async validateShema(schema, data) {
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

      throw new ErrorWithProps('UnProcessable Entity', {
        validation: validationErrors,
        statusCode: 422,
      });
    }
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async patchUserOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const getOptions = await this.retrieveUserOptions(id, props);
    const { User } = this.sequelize.models;

    const affectedRow = await User.update(
      {
        options: getOptions,
      },
      {
        where: {
          id,
        },
      },
    );

    return { affectedRow, id };
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async retrieveUserOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { User } = this.sequelize.models;
    const user = await User.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = user.dataValues.options;

    Object.keys(props).forEach((name) => {
      const booleanStatus = props[`${name}`];
      const value = userOption[`${name}`];
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

module.exports = UserUpdate;
