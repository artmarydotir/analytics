/* eslint-disable sonarjs/cognitive-complexity */
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

    return Project.findAll({
      attributes: {
        exclude: ['updatedAt', 'privateToken'],
      },
      where: query,
      include: [
        {
          model: User,
          attributes: ['username'],
          through: {
            attributes: [],
          },
        },
      ],
      limiting,
      order: [['id', 'DESC']],
    });
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
    const query = {};
    let limiting = 10;


    if (filter) {
      Object.keys(filter).forEach((field) => {
        const m = field.match(/^([a-z0-9]+)_([a-z0-9]+)/i);
        const value = filter[`${field}`];

        if (m) {
          const type = m[1];
          const name = m[2];

          if (['dts', 'dte', 'like'].includes(type) && !query[`${name}`]) {
            query[`${name}`] = {};
          }

          if (type === 'like') {
            query[`${name}`] = {
              [Op.like]: `%${value.replace(/["']+/g, ' ')}%`,
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

    // [
    //   '"n1" = ":asddsad"',
    //   '"n2" = "v2"',
    // ];
    // {
    //   "colmen" : "",
    // }

    // var a = [
    //   {
    //     col: 'c1',
    //     op: 'eq',
    //     val: 'v1',
    //   },
    // ];


    const { UserProject } = this.sequelize.models;

    const userProjectList = await this.sequelize.query(
      `SELECT
        *
      FROM "UserProjects"
      LEFT JOIN "Projects" ON (
        "Projects"."id" = "UserProjects"."ProjectId"
      )
      WHERE
        "UserProjects"."UserId" = :userId
        `${}`
      AND
        "Projects"."enabled" = true

      ORDER BY "Projects"."id" DESC
      LIMIT :limiting;
      `,
      {
        replacements: { userId, limiting },
        model: UserProject,
        mapToModel: true,
      },
    );
    // [ 3, 10, 11, 26, 37, 53 ]
    console.log(userProjectList);
    // const b = await UserProject.findAll({
    //   // where: query,
    //   where: {
    //     UserId: userId,
    //   },
    //   include: [
    //     {
    //       model: Project,
    //       attributes: ['username'],
    //       through: {
    //         attributes: [],
    //       },
    //       required: true,
    //     },
    //   ],
    //   limiting,
    //   order: [['id', 'DESC']],
    // });

    // const all = [];
    // b.forEach((element) => {
    //   all.push(element.ProjectId);
    //   // console.log(element.dataValues.ProjectId);
    // });

    // console.log(all);
    // [ 3, 10, 11, 26, 37, 53 ]
    // const c = await Project.findAll({
    //   attributes: {
    //     exclude: ['updatedAt', 'privateToken'],
    //   },
    //   where: {
    //     id: all,
    //   },
    //   limiting,
    //   order: [['id', 'DESC']],
    // });

    // console.log(c);
  }
}

module.exports = ProjectList;
