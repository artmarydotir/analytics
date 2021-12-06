const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class ProjectPrivateToken {
  constructor({ sequelize, UserProcessRepository }) {
    this.sequelize = sequelize;
    this.user = UserProcessRepository;
  }

  /**
   *
   * @param {Number} userId
   * @param {Number} projectId
   * @param {String} password
   * @returns {Promise<object>}
   */

  async returnProjectPrivateToken(projectId, password, userId) {
    const { Project, User } = this.sequelize.models;

    if (!projectId || !password || !userId) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const data = {
      isValidPassword: false,
      pToken: null,
    };

    const userHashedPassword = await User.findOne({
      where: {
        id: userId,
      },
      attributes: ['password'],
    });

    if (userHashedPassword) {
      data.isValidPassword = await this.user.verifyPassword(
        userHashedPassword.password,
        password,
      );
    }

    if (!data.isValidPassword) {
      throw new ErrorWithProps(errorConstMerge.INVALID_PASSWORD, {
        statusCode: 400,
      });
    }

    const project = await Project.findOne({
      attributes: ['privateToken'],
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    data.pToken = project.privateToken;
    return data;
  }
}

module.exports = ProjectPrivateToken;
