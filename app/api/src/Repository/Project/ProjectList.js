const { Op } = require('sequelize');

class ProjectList {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  async getProjectDomainList() {
    const { Project, Domain } = this.sequelize.models;

    const allProject = await Domain.findAll({
      attributes: ['domain', 'wildcardDomain'],
      where: {
        options: { [Op.contains]: [1] },
      },
      include: [
        {
          model: Project,
          attributes: ['publicToken'],
          where: {
            options: { [Op.contains]: [1] },
          },
          required: false,
        },
      ],
    });

    const result = {};
    allProject.forEach((r) => {
      if (!result[r.Project.dataValues.publicToken]) {
        result[r.Project.dataValues.publicToken] = [];
      }
      if (r.domain) {
        result[r.Project.dataValues.publicToken].push(r.domain);
      } else if (r.wildcardDomain) {
        result[r.Project.dataValues.publicToken].push(r.wildcardDomain);
      }
    });

    return result;
  }
}

module.exports = ProjectList;
