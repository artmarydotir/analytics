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
        [Op.gt]: lastSeen,
      };
    }

    const { User, Project } = this.sequelize.models;

    return Project.findAll({
      attributes: [
        'id',
        'publicToken',
        'title',
        'description',
        'options',
        'additional',
        'createdAt',
      ],
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
}

module.exports = ProjectList;
