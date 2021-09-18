/* eslint-env jest */

// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */
  let container;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);
    const pg = container.resolve('pgClient');

    const query4 = 'TRUNCATE TABLE projects RESTART IDENTITY CASCADE';
    const query5 = 'TRUNCATE TABLE user_project RESTART IDENTITY CASCADE';
    await pg.query(query4);
    await pg.query(query5);
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('add project', async () => {
    const createProject = container.resolve('CreateProjectRepository');

    try {
      const b = await createProject.addProject({
        title: 'donyayeEghtesad',
        publicToken: '123654',
        userAndRoles: [
          {
            userID: 1,
            roles: ['0', '1'],
          },
          {
            userID: 3,
            roles: ['0'],
          },
          {
            userID: 4,
            roles: ['4'],
          },
        ],
        additional: {},
      });
      console.log(b);
    } catch (error) {
      console.log(error);
      // console.log(error.extensions);
    }
  });
});
