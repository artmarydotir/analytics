const { Pool } = require('pg');

class Postgres {
  constructor({ Config, Logger }) {
    /**
     * @private
     * @type {import('pg').Pool}
     */
    this.pool = new Pool({
      connectionString: Config.ASM_POSTGRES_URI,
      log(...messages) {
        Logger.debug({ msg: messages[0] }, 'pg');
      },
    });

    /**
     * @private
     * @type {import('pg').PoolClient}
     */
    this.poolClient = undefined;
  }

  /**
   * @returns {Promise<import('pg').PoolClient>}
   */
  async getClient() {
    if (this.poolClient === undefined) {
      this.poolClient = await this.pool.connect();
    }
    return this.poolClient;
  }

  /**
   * @returns {Promise<void>}
   */
  async end() {
    if (this.pool) {
      this.poolClient.release();
      await this.pool.end();
      this.pool = undefined;
      this.poolClient = undefined;
    }
  }
}

module.exports = Postgres;
