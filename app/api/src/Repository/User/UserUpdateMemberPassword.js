const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const {
  UpdateMemberPassword: membersPasswordSchema,
} = require('../../JoySchema/User');

class UserUpdateMemberPassword {
  constructor({ sequelize, UserProcessRepository }) {
    this.sequelize = sequelize;
    this.process = UserProcessRepository;
  }

  /**
   * @param {Number} id
   * @param {String} currentPassword
   * @param {String} newPassword
   */

  async setMemberPassword(id, currentPassword, newPassword) {
    const schema = membersPasswordSchema();
    const data = {
      id,
      currentPassword,
      newPassword,
    };

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

    const user = await this.process.returnActiveUserDataByID(id);

    const validPassword = await this.process.verifyPassword(
      user.password,
      currentPassword,
    );
    if (validPassword) {
      await this.process.resetUserPassword(id, newPassword);
    }

    return id;
  }
}

module.exports = UserUpdateMemberPassword;
