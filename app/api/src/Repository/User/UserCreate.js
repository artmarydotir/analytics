const validator = require('validator').default;
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const { constants: userRoleObject } = require('../../Schema/UserRoles');

const { CreateUserSchema: userJoiSchema } = require('../../JoySchema/User');

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
   * @param {String} data.password
   * @param {String} data.role
   * @param {String} data.lang
   * @param {Number[]} data.options
   * @param {String} data.country
   * @param {String} data.mobile
   * @param {Object} data.additional
   */
  async addUser(data) {
    const {
      username,
      email,
      password,
      role = userRoleObject.VIEWER,
      lang = 'fa',
      options = [1],
      country = 'IR',
      mobile,
      additional = {},
    } = data;

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

      throw new ErrorWithProps('UnProcessable Entity', {
        validation: validationErrors,
        statusCode: 422,
      });
    }

    const initialValues = {
      username: null,
      email: null,
      password: null,
      role: null,
      otp_secret: null,
      lang: null,
      options: null,
      country: null,
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

    if (options) {
      initialValues.options = options;
    }

    if (additional && typeof additional === 'object') {
      initialValues.additional = additional;
    }

    /**
     ***
     *** INSERT ***
     ***
     */
    const { User } = this.sequelize.models;
    return User.create(initialValues);
  }
}

module.exports = UserCreate;
