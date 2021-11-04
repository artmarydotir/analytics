const { ErrorWithProps } = require('mercurius').default;

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

      throw new ErrorWithProps('UnProcessable Entity', {
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
      const newPasswordHash = await this.process.setPassword(newPassword);
      await this.process.resetUserPassword(id, newPasswordHash);
    }

    return id;
  }
}

module.exports = UserUpdateMemberPassword;
