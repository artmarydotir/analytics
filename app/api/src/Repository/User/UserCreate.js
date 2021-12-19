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
      username: null,
      email: null,
      password: null,
      role: userRoleObject.CLIENT,
      otpSecret: null,
      lang: null,
      options: [userOption.ACTIVE],
      country: 'IR',
      mobile: null,
      additional: null,
    };

    initialValues.username = username.toLowerCase();

    if (email && validator.isEmail(email)) {
      initialValues.email = validator.normalizeEmail(email);
    }

    const passwordHash = await this.process.setPassword(password);
    if (passwordHash) {
      initialValues.password = passwordHash;
    }

    initialValues.role = role;

    initialValues.lang = lang;

    initialValues.otpSecret = this.process.generateNewOtpSecret();

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

    if (options.length > 0) {
      initialValues.options = options;
    }

    /**
     ***
     *** INSERT ***
     ***
     */
    const { User } = this.sequelize.models;

    try {
      return await User.create(initialValues);
    } catch (e) {
      if (e.errors) {
        SequelizeErrorHandler(e);
      }
    }
  }
}

module.exports = UserCreate;
