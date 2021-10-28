const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

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
    // FIXME: JOI VALIDATION FOR PASSWORD
    if (!token || !newPassword) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
        statusCode: 400,
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
