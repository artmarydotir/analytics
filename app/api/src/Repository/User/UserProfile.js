const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class UserProfile {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   *
   * @param {Number} userId
   * @returns {Promise<object>}
   */

  async returnUserData(userId) {
    const { User } = this.sequelize.models;

    if (!userId) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }
    const user = await User.findOne({
      attributes: [
        'id',
        'username',
        'role',
        'lang',
        'country',
        'mobile',
        'options',
      ],
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return user.dataValues;
  }
}

module.exports = UserProfile;
