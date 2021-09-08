// eslint-disable-next-line no-unused-vars
const chalk = require('chalk');

// eslint-disable-next-line no-unused-vars
const { log } = console;

const options = [
  {
    flags: '-u, --users <id>',
    description: 'Comma separated of user identifiers',
    required: true,
  },
];

module.exports = {
  name: 'password-reset',
  options,
  description: 'Password reset for bulk of user ids',
  /**
   * @param {import('awilix').AwilixContainer} container
   * @param {Object} args
   */
  // eslint-disable-next-line no-unused-vars
  async runAction(container, { users }) {
    log(users.split(','));
    log(chalk`{green ok}`);
  },
};
