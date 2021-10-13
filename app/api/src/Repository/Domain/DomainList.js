const { Op } = require('sequelize');

class DomainList {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async fetchDomainList({
    lastSeen = undefined,
    filter = {},
    limit,
    attribute,
  }) {
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
          } else if (type === 'dts') {
            query[`${name}`] = {
              [Op.gte]: new Date(value),
            };
          } else if (type === 'dte') {
            query[`${name}`] = {
              [Op.lte]: new Date(value),
            };
          } else if (type === 'boolean') {
            query[`${name}`] = value;
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

    const { Project, Domain } = this.sequelize.models;

    const result = await Domain.findAll({
      attributes: attribute,
      where: query,
      include: [
        {
          model: Project,
          attributes: ['title'],
          required: false,
        },
      ],
      limiting,
      order: [['id', 'DESC']],
    });

    const c = result.map((element) => ({
      ...element.dataValues,
      projectName: element.Project.dataValues,
    }));

    c.forEach((x) => {
      // eslint-disable-next-line no-param-reassign
      delete x.Project;
    });

    return c;
  }
}

module.exports = DomainList;
