const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');
const {
  ResetPasswordSchema: resetPasswordJoi,
} = require('../../JoySchema/ResetPassword');

// For Rest Interface
class UserResetPassword {
  constructor({ sequelize, Redis, UserProcessRepository }) {
    /**  */
    this.Redis = Redis;
    this.sequelize = sequelize;
    this.process = UserProcessRepository;
  }

  /**
   *
   * @param {String} token
   * @param {String} newPassword
   * @returns {Promise<{}>}
   */
  async checkTokenAndResetUserPassword(token, newPassword) {
    const data = {
      token,
      newPassword,
    };
    const schema = resetPasswordJoi();

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

    const { User } = this.sequelize.models;
    const redis = await this.Redis.getRedis();
    const userId = await redis.get(`forget_password:${token}`);

    if (userId) {
      const user = await this.process.isUserExistByID(userId);

      if (user) {
        await User.update(
          {
            password: await this.process.setPassword(newPassword),
          },
          {
            where: {
              id: userId,
            },
          },
        );
        await redis.del(`forget_password:${token}`);
        return true;
      }
    }
    throw new ErrorWithProps(errorConstMerge.OTHER_ERROR, {
      statusCode: 400,
    });
  }
}

module.exports = UserResetPassword;
