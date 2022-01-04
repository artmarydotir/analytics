/* eslint-disable no-param-reassign */
/* eslint-disable sonarjs/cognitive-complexity */
const { Op } = require('sequelize');

class ProjectSimpleList {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  async fetchProjectSimpleList({ lastSeen = undefined, filter = {}, limit }) {
    const where = {};
    let limiting = 10;

    if (filter) {
      Object.keys(filter).forEach((field) => {
        const m = field.match(/^([a-z0-9]+)_([a-z0-9]+)/i);
        const value = filter[`${field}`];

        if (m) {
          const type = m[1];
          const name = m[2];

          if (['like', 'ids'].includes(type) && !where[`${name}`]) {
            where[`${name}`] = {};
          }

          if (type === 'like') {
            where[`${name}`] = {
              [Op.like]: `%${value.replace(/["']+/g, ' ')}%`,
            };
          } else if (type === 'ids') {
            where[`${name}`] = value;
          }
        }
      });
    }

    if (limit && Number.isInteger(limit) && limit >= 1 && limit <= 80) {
      limiting = limit;
    }

    if (lastSeen) {
      where.id = {
        [Op.lt]: lastSeen,
      };
    }

    const { Project } = this.sequelize.models;

    const result = await Project.findAll({
      attributes: ['id', 'title'],
      where,
      limit: limiting,
      order: [['id', 'DESC']],
    });

    return { docs: result };
  }
}

module.exports = ProjectSimpleList;
