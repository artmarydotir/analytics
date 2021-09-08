const { readFile } = require('fs').promises;

// eslint-disable-next-line no-unused-vars
const chalk = require('chalk');

// eslint-disable-next-line no-unused-vars
const { log } = console;

module.exports = {
  name: 'postgres-init',
  description: 'Initialize postgres',
  /**
   * @param {import('awilix').AwilixContainer} container
   * @param {Object} options
   */
  // eslint-disable-next-line no-unused-vars
  async runAction(container, options) {
    /** @type {import('pg').Client} */
    const pgClient = container.resolve('pgClient');
    const sql = await readFile('/app/api/assets/postgres/init.sql', {
      encoding: 'utf8',
    });
    await pgClient.query(sql);
  },
};
