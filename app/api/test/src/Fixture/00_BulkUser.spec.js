/* eslint-disable no-plusplus */
// eslint-disable-next-line node/no-unpublished-require
// const faker = require('faker/locale/en');

/* eslint-env jest */

// @ts-ignore
require('../../../globals');

const { initContainer } = require('../../../src/Container');
const { Config } = require('../../../src/Config');
const { list: userRoles } = require('../../../src/Schema/UserRoles');

const { ConfigSchema } = require('../../../src/ConfigSchema');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */

  let container;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);
    const pg = container.resolve('pgClient');

    const query4 = 'TRUNCATE TABLE users RESTART IDENTITY CASCADE';
    await pg.query(query4);
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('it should insert fake user', async () => {
    const createUser = container.resolve('CreateUserRepository');

    const roles = userRoles;
    const lang = ['fa', 'en'];

    const userList = [];
    for (let index = 0; index < 60; index++) {
      const roleIndex = index % roles.length;

      userList.push({
        username: `user${index}`,
        password: `user${index}PassW0rd`,
        email: `user${index}@example.tld`,
        role: roles[`${roleIndex}`],
        lang: lang[Math.floor(Math.random() * lang.length)],
        options: [1],
      });
    }

    const easternPromises = [];

    userList.forEach((element) => {
      easternPromises.push(createUser.addUser(element));
    });
    await Promise.all(easternPromises);
  });
});
