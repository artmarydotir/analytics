/* eslint-disable no-param-reassign */
/* eslint-disable sonarjs/cognitive-complexity */
const { QueryTypes } = require('sequelize');
const { Op } = require('sequelize');

class ProjectList {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  async fetchProjectList({ lastSeen = undefined, filter = {}, limit }) {
    const query = {};
    let limiting = 10;

    if (filter) {
      Object.keys(filter).forEach((field) => {
        const m = field.match(/^([a-z0-9]+)_([a-z0-9]+)/i);
        const value = filter[`${field}`];

        if (m) {
          const type = m[1];
          const name = m[2];

          if (
            ['arrIn', 'dts', 'dte', 'like', 'id'].includes(type) &&
            !query[`${name}`]
          ) {
            query[`${name}`] = {};
          }

          if (type === 'like') {
            query[`${name}`] = {
              [Op.like]: `%${value.replace(/["']+/g, ' ')}%`,
            };
          } else if (type === 'arrIn') {
            query[`${name}`] = {
              [Op.contains]: value,
            };
          }
          const a = {};
          if (type === 'dts') {
            a[Op.gte] = new Date(value);
          } else if (type === 'dte') {
            a[Op.lte] = new Date(value);
          }
          query[`${name}`] = {
            ...query[`${name}`],
            ...a,
          };
        }
      });
    }

    if (limit && Number.isInteger(limit) && limit >= 1 && limit <= 80) {
      limiting = limit;
    }

    if (lastSeen) {
      query.id = {
        [Op.lt]: lastSeen,
      };
    }

    const { User, Project } = this.sequelize.models;

    const result = await Project.findAll({
      attributes: {
        exclude: ['updatedAt', 'privateToken', 'description'],
      },
      where: query,
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      limit: limiting,
      order: [['id', 'DESC']],
    });

    const docs = result.map((project) => ({
      id: project.id,
      title: project.title,
      options: project.options,
      additional: project.additional,
      publicToken: project.publicToken,
      createdAt: project.createdAt,
      owner: project.Users.map((user) => ({
        username: user.username,
      })),
    }));

    return { docs };
  }

  /**
   *
   * @param {*} userId
   * @param {*} param1
   * @returns
   */
  async fetchProjectListByOwner(
    userId,
    { lastSeen = undefined, filter = {}, limit },
  ) {
    const query = [];
    let limiting = 10;

    if (filter) {
      Object.keys(filter).forEach((field) => {
        const m = field.match(/^([a-z0-9]+)_([a-z0-9]+)/i);
        const value = filter[`${field}`];

        if (m) {
          const type = m[1];
          const name = m[2];

          if (
            ['dts', 'dte', 'like', 'ids'].includes(type) &&
            !query[`${name}`]
          ) {
            query.push({
              colName: `${name}`,
            });
          }

          if (type === 'like') {
            query.forEach((q) => {
              const validValue = value.replace(/["']+/g, ' ').trim();
              if (validValue && q.colName === `${name}`) {
                q.colOp = 'LIKE';
                q.colValue = `%${validValue}%`;
              }
            });
          }
        }
      });
    }

    if (lastSeen) {
      query.push({
        colName: 'id',
        colOp: '<',
        colValue: lastSeen,
      });
    }

    // Creating the query condition
    const queryBuilding = [];
    query.forEach((q) => {
      if (q.colValue) {
        queryBuilding.push(
          `"Projects"."${q.colName}" ${q.colOp} :${q.colName}Val`,
        );
      }
    });

    // Creating variables for query
    const queryValues = {};
    query.forEach((q) => {
      queryValues[`${q.colName}Val`] = q.colValue;
    });

    if (limit && Number.isInteger(limit) && limit >= 1 && limit <= 80) {
      limiting = limit;
    }

    const { UserProject } = this.sequelize.models;

    const appendingCondition =
      queryBuilding.length > 0 ? `AND ${queryBuilding.join(' AND ')}` : '';

    const projectDataList = await this.sequelize.query(
      `SELECT
      "Projects"."id",
      "Projects"."title",
      "Projects"."description",
      "Projects"."publicToken",
      "UserProjects"."rules"

        FROM "UserProjects"
          LEFT JOIN "Projects" ON (
            "Projects"."id" = "UserProjects"."ProjectId"
          )
        WHERE
          "UserProjects"."UserId" = :userId
        AND
          "Projects"."enabled" = true
        ${appendingCondition}

        ORDER BY "Projects"."id" DESC
        LIMIT :limiting;
      `,
      {
        replacements: { userId, limiting, ...queryValues },
        model: UserProject,
        mapToModel: true,
        type: QueryTypes.SELECT,
      },
    );

    const promises = [];

    // console.log(projectDataList);
    projectDataList.forEach((project) => {
      const re = this.findAllUserByProjectId(project.id).then((users) => {
        project.members = users;
      });
      promises.push(re);
    });

    await Promise.all(promises);

    return projectDataList.map((project) => ({
      id: project.dataValues.id,
      title: project.dataValues.title,
      description: project.dataValues.description,
      publicToken: project.dataValues.publicToken,
      rules: project.rules,
      members: project.members,
    }));
  }

  /**
   *
   * @param {*} projectId
   * @returns
   */
  async findAllUserByProjectId(projectId) {
    const { UserProject } = this.sequelize.models;

    const rawQueryFindAllUsernameProjectById = `
      SELECT
        "Users"."id",
        "Users"."username"
      FROM "Users"
        LEFT JOIN "UserProjects" ON (
          "Users"."id" = "UserProjects"."UserId"
        )
      WHERE
        "UserProjects"."ProjectId" = :projectId
      AND
        "Users"."options" = ARRAY[1]
      ORDER BY "Users"."id" ASC;
    `;

    const result = await this.sequelize.query(
      rawQueryFindAllUsernameProjectById,
      {
        replacements: { projectId },
        model: UserProject,
        mapToModel: true,
        type: QueryTypes.SELECT,
      },
    );

    return result.map((user) => ({
      id: user.dataValues.id,
      username: user.dataValues.username,
    }));
  }
}

module.exports = ProjectList;
