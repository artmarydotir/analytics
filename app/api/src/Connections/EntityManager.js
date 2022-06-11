const { Sequelize } = require('sequelize');

const ProjectEntity = require('../Entities/Project');
const UserEntity = require('../Entities/User');
const UserProjectEntity = require('../Entities/UserProject');
const DomainEntity = require('../Entities/Domain');
const UptimeEntity = require('../Entities/UptimeMonitor');
const PerformanceEntity = require('../Entities/PerformanceMonitor');

class EntityManager {
  constructor({ Config, Logger }) {
    this.Config = Config;
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
      UptimeEntity(this.sequelize);
      PerformanceEntity(this.sequelize);
      await this.sequelize.authenticate();

      await this.sequelize.sync({
        force: this.Config.testMode && this.Config.ASM_PM_ID === 0,
      });
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
