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

    const usersDoc = await this.sequelize.query(
      `
        SELECT
          "UserProjects"."rules" AS "rules",
          "UserProjects"."UserId" AS "UserId",
          "UserProjects"."ProjectId" AS "ProjectId",
          "Users"."username" AS "username"
        FROM "UserProjects"
        LEFT JOIN "Users" ON ("Users"."id" = "UserProjects"."UserId")
        WHERE "ProjectId" = :projectId
      `,
      {
        replacements: { projectId },
        model: UserProject,
        mapToModel: true,
      },
    );

    if (!project) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    const userList = [];
    usersDoc.forEach((item) => {
      const { rules, username, UserId } = item.dataValues;
      userList.push({
        rules,
        UserId,
        username,
      });
    });

    return {
      ...project.dataValues,
      userAndRules: userList,
    };
  }
}

module.exports = ProjectProfile;
