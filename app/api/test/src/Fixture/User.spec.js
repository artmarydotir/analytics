// eslint-disable-next-line node/no-unpublished-require
const faker = require('faker/locale/en');

/* eslint-env jest */

// @ts-ignore
require('../../../globals');

const { initContainer } = require('../../../src/Container');
const { Config } = require('../../../src/Config');
const { ConfigSchema } = require('../../../src/ConfigSchema');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */

  let container;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('it should insert fake user', async () => {
    /** @type {import('pg').Client} */
    const pgClient = container.resolve('pgClient');
    const text =
      'INSERT INTO users(username, password, email, role, otp_secret , lang, options, mobile) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';

    const role = ['SA', 'AD', 'ME'];
    const lang = ['fa', 'en'];

    const valueList = [];
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < 80; index++) {
      valueList.push([
        faker.internet.userName(),
        faker.internet.password(),
        faker.internet.email(),
        role[Math.floor(Math.random() * role.length)],
        faker.internet.password(),
        lang[Math.floor(Math.random() * lang.length)],
        [1],
        faker.phone.phoneNumber(),
      ]);
    }

    const easternPromises = [];

    valueList.forEach((element) => {
      try {
        const res = pgClient.query(text, element);
        easternPromises.push(res);
      } catch (err) {
        return err.stack;
      }
    });
    await await Promise.all(easternPromises);
  });
});
