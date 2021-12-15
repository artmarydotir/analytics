// eslint-disable-next-line no-unused-vars
const chalk = require('chalk');

// eslint-disable-next-line no-unused-vars
const { log } = console;

const { list: UserRoles } = require('../src/Schema/UserRoles');

const options = [
  {
    flags: '-u, --user <id>',
    description: 'Special user id',
    required: true,
  },
  {
    flags: '-r, --roles <roles>',
    description: `User roles, possible roles are: ${UserRoles.join(',')}`,
    required: true,
    default: UserRoles.join(','),
  },
  {
    flags: '-u, --upload <upload>',
    description: 'Upload size',
    required: true,
    default: (1024 * 1024 * 512).toString(),
  },
  {
    flags: '-p, --pubsub <pubsub>',
    description: 'Can access pubsub',
    required: true,
    default: 'true',
  },
  {
    flags: '-ttl, --time-to-live <ttl>',
    description: 'Time to live',
    required: true,
    default: 3600,
  },
];

module.exports = {
  name: 'user-token',
  options,
  description: `Generate user token payload`,
  /**
   * @param {import('awilix').AwilixContainer} container
   * @param {Object} options
   */
  async runAction(container, { user, roles, upload, pubsub, timeToLive }) {
    const JWT = container.resolve('JWT');
    const Config = container.resolve('Config');

    /** @type {import('../addon').Token} */
    const requestToken = {
      uid: user,
      pubsub: pubsub === 'true',
      roles: roles.split(',').map((r) => r.trim().toUpperCase()),
      upload: parseInt(upload, 10),
    };

    const token = await JWT.signUser(requestToken, timeToLive);

    const d = new Date();
    d.setTime(d.getTime() + timeToLive * 1000);

    log(chalk`{magenta User Data}`);
    log(chalk`{yellow ${JSON.stringify(requestToken)}}`);
    log(chalk`{magenta Your token is}`);
    log(token);
    log(chalk`{magenta Set via cookie}`);
    log(
      `document.cookie = "${Config.ASM_AUTH_COOKIE}=${token}; Path=${
        Config.ASM_PUBLIC_BASE_URL
      }api; Expires=${d.toUTCString()}"`,
    );
    log(chalk`{magenta Set via header}`);
    log(`Bearer ${token}`);
    log(chalk`{magenta Set via curl}`);
    log(`curl -k -H 'Authorization: Bearer ${token}'`);

    await container.dispose();
  },
};
