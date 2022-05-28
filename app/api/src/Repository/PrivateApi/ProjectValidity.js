class ProjectValidity {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.privateToken
   * @param {string} params.publicToken
   * @returns {Promise<boolean>}
   */
  async checkPairKey({ publicToken, privateToken }) {
    const { Project } = this.sequelize.models;

    const project = await Project.findOne({
      attributes: ['id'],
      where: {
        publicToken,
        privateToken,
        enabled: true,
      },
    });

    return !!project;
  }
}

module.exports = ProjectValidity;
