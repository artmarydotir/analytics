const { ErrorWithProps } = require('mercurius').default;
const { UserAuthSchema: authJoiSchema } = require('../../JoySchema/Auth');
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const { constants } = require('../../Schema/UserAuthType');

class Authentication {
  constructor({ UserProcessRepository, sequelize, CaptchaRepository }) {
    this.sequelize = sequelize;
    this.user = UserProcessRepository;
    this.captcha = CaptchaRepository;
  }

  /**
   * @param {String} type
   * @param {Object} data
   * @param {String} [data.email]
   * @param {String} [data.password]
   * @param {String} [data.otp]
   * @param {Object} [data.captcha]
   * @returns {Promise<Boolean>}
   */

  async signIn(type, data) {
    const { email, password, otp, captcha } = data;
    const incomingData = {
      type,
      email,
      password,
      otp,
      captcha,
    };

    const schema = authJoiSchema();

    let success = false;

    try {
      await schema.validateAsync(incomingData, { abortEarly: false });
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

    const userData = await this.user.returnActiveUserData({ email });

    if (type === constants.AUTH_PASSWORD) {
      const validPassword = await this.user.verifyPassword(
        userData.password,
        password,
      );

      const isValidCaptcha = await this.captcha.solveCaptcha(
        captcha.id,
        captcha.value,
      );

      success = validPassword && isValidCaptcha;
    } else if (type === constants.AUTH_OTP) {
      const validOtp = this.user.verifyOtp(otp);
      success = validOtp;
    }

    if (success) {
      return userData;
    }

    throw new ErrorWithProps('Invalid user data', {
      statusCode: 400,
    });
  }
}

module.exports = Authentication;
