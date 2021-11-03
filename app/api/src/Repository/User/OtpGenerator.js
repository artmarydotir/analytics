const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class OtpGenerator {
  constructor({ sequelize, UserProcessRepository }) {
    this.sequelize = sequelize;
    this.process = UserProcessRepository;
  }

  /**
   * @param {String} id
   * @param {String} currentPassword
   * @returns {Promise<String>}
   */

  async generateNewOtp(id, currentPassword) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }
    const user = await this.process.returnActiveUserDataByID(id);

    if (currentPassword) {
      const isValidPassword = await this.process.verifyPassword(
        user.password,
        currentPassword,
      );

      if (!isValidPassword) {
        throw new ErrorWithProps(errorConstMerge.INVALID_PASSWORD, {
          statusCode: 400,
        });
      }
    }

    const otpSecret = await this.process.generateNewOtpSecret();
    const { User } = this.sequelize.models;
    await User.update(
      {
        otpSecret,
      },
      {
        where: {
          id,
        },
      },
    );

    return otpSecret;
  }
}

module.exports = OtpGenerator;
