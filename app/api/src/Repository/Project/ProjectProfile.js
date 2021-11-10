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
    const { Project, UserProject, User } = this.sequelize.models;

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
          "Users"."username" AS "Username"
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

    // console.log(usersDoc);

    // const usersDoc = await UserProject.findAll({
    //   // attributes: ['rules', 'UserId', 'ProjectId'],
    //   where: {
    //     ProjectId: projectId,
    //   },
    // });

    if (!project) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    console.log(usersDoc);
    const userList = [];
    if (usersDoc.length > 0) {
      usersDoc.map((user) => {
        console.log('9999', usersDoc);
        const { UserId, rules, Username } = user;
        return userList.push({
          UserId,
          rules,
          Username,
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
