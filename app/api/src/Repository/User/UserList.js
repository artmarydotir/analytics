/* eslint-disable sonarjs/cognitive-complexity */
const { Op } = require('sequelize');

class UserList {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  async fetchUserList({
    lastSeen = undefined,
    filter = {},
    limit,
    attributes,
  }) {
    const where = {};
    let limiting = 10;

    if (filter) {
      Object.keys(filter).forEach((field) => {
        const m = field.match(/^([a-z0-9]+)_([a-z0-9]+)/i);
        const value = filter[`${field}`];

        if (m) {
          const type = m[1];
          const name = m[2];

          if (
            ['arrIn', 'dts', 'dte', 'eq', 'like'].includes(type) &&
            !where[`${name}`]
          ) {
            where[`${name}`] = {};
          }

          if (type === 'like') {
            where[`${name}`] = {
              [Op.like]: `%${value.replace(/["']+/g, ' ')}%`,
            };
          } else if (type === 'eq') {
            where[`${name}`] = {
              [Op.eq]: value,
            };
          } else if (type === 'arrIn') {
            where[`${name}`] = {
              [Op.contains]: value,
            };
          } else if (type === 'dts') {
            where[`${name}`] = {
              [Op.gte]: new Date(value),
            };
          } else if (type === 'dte') {
            where[`${name}`] = {
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
      where.id = {
        [Op.lt]: lastSeen,
      };
    }

    const { User } = this.sequelize.models;

    const result = await User.findAll({
      attributes,
      where,
      limit: limiting,
      order: [['id', 'DESC']],
    });

    return { docs: result };
  }
}

module.exports = UserList;
