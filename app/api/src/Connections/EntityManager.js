const { Sequelize } = require('sequelize');

const ProjectEntity = require('../Entities/Project');
const UserEntity = require('../Entities/User');
const UserProjectEntity = require('../Entities/UserProject');
const DomainEntity = require('../Entities/Domain');

class EntityManager {
  constructor({ Config, Logger }) {
    this.testMode = Config.ASM_PUBLIC_APP_TEST;
    this.connectionString = Config.ASM_POSTGRES_URI;
    this.sequelize = undefined;
    this.Logger = Logger;
    this.Entities = {};
  }

  async getSequelize() {
    if (this.sequelize === undefined) {
      this.sequelize = new Sequelize(this.connectionString, {
        logging: (...msg) => {
          this.Logger.debug(msg[0]);
        },
      });
      UserEntity(this.sequelize);
      ProjectEntity(this.sequelize);
      UserProjectEntity(this.sequelize);
      DomainEntity(this.sequelize);
      await this.sequelize.authenticate();
      await this.sequelize.sync({ force: this.testMode });
    }
    return this.sequelize;
  }

  /**
   * @returns {Promise<void>}
   */
  async quit() {
    if (this.sequelize) {
      await this.sequelize.close();
      this.sequelize = undefined;
    }
  }
}

module.exports = EntityManager;
