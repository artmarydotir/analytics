const validator = require('validator').default;
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const { constants: userRoleObject } = require('../../Schema/UserRoles');
const { constants: userOption } = require('../../Schema/UserOption');

const { CreateUserSchema: userJoiSchema } = require('../../JoySchema/User');
const SequelizeErrorHandler = require('../../Utils/SequelizeErrorHandler');

class UserCreate {
  constructor({ sequelize, UserProcessRepository }) {
    this.sequelize = sequelize;
    this.process = UserProcessRepository;
  }

  /**
   * @param {Object} data
   * @param {String} data.username
   * @param {String} data.email
   * @param {String} data.password
   * @param {String} data.role
   * @param {String} data.lang
   * @param {Number[]} data.options
   * @param {String} data.country
   * @param {String} data.mobile
   * @param {Object} data.additional
   */
  async addUser(data) {
    const { username, email, password, role, lang, options, country, mobile } =
      data;

    const schema = userJoiSchema();

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
      username: username.toLowerCase(),
      email: null,
      password: null,
      role: role || userRoleObject.CLIENT,
      otpSecret: null,
      lang: lang || null,
      options: [userOption.ACTIVE],
      country: country || 'IR',
      mobile: null,
      additional: null,
    };

    if (email && validator.isEmail(email)) {
      initialValues.email = validator.normalizeEmail(email);
    }

    const passwordHash = await this.process.setPassword(password);
    if (passwordHash) {
      initialValues.password = passwordHash;
    }

    initialValues.otpSecret = this.process.generateNewOtpSecret();

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

    if (options.length > 0) {
      initialValues.options = options;
    }

    /**
     ***
     *** INSERT ***
     ***
     */
    const { User } = this.sequelize.models;

    let result;
    try {
      result = await User.create(initialValues);
    } catch (e) {
      if (e.errors) {
        SequelizeErrorHandler(e);
      }
    }
    return result;
  }
}

module.exports = UserCreate;
