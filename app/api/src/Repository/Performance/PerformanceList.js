const { Op } = require('sequelize');

class PerformanceList {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async fetchPerformanceList({ lastSeen = undefined, filter = {}, limit }) {
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
            ['arrIn', 'dts', 'dte', 'like', 'boolean'].includes(type) &&
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

    const { Performance } = this.sequelize.models;

    const result = await Performance.findAll({
      attributes: ['id', 'name', 'url', 'interval', 'options', 'createdAt'],
      where: query,
      limit: limiting,
      order: [['id', 'DESC']],
    });

    return {
      docs: result,
    };
  }
}

module.exports = PerformanceList;
