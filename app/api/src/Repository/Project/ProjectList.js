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
            ['arrIn', 'dts', 'dte', 'like'].includes(type) &&
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
          } else if (type === 'dts') {
            query[`${name}`] = {
              [Op.gte]: new Date(value),
            };
          } else if (type === 'dte') {
            query[`${name}`] = {
              [Op.lte]: new Date(value),
            };
          }
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

          if (['dts', 'dte', 'like'].includes(type) && !query[`${name}`]) {
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
      `SELECT "title", "id", "description", "publicToken"
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

    const result = projectDataList.map((project) => ({
      ...project.dataValues,
    }));

    return { docs: result };
  }
}

module.exports = ProjectList;
