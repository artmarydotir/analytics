const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class ProjectProfile {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   *
   * @param {Number} projectId
   * @returns {Promise<object>}
   */

  async returnProjectData(projectId) {
    const { Project, UserProject } = this.sequelize.models;

    if (!projectId) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const project = await Project.findOne({
      attributes: ['id', 'title', 'publicToken', 'description', 'options'],
      where: {
        id: projectId,
      },
    });

    const usersDoc = await UserProject.findAll({
      attributes: ['category', 'UserId', 'ProjectId'],
      where: {
        ProjectId: projectId,
      },
    });

    if (!project) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    const userList = [];
    if (usersDoc.length > 0) {
      usersDoc.map((user) => {
        const { UserId, category } = user;
        return userList.push({
          UserId,
          category,
        });
      });
    }

    return {
      ...project.dataValues,
      userAndRules: userList,
    };
  }
}

module.exports = ProjectProfile;
