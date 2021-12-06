/* eslint-env jest */

// @ts-ignore
require('../../../globals');

const { initContainer } = require('../../../src/Container');
const { Config } = require('../../../src/Config');
const { ConfigSchema } = require('../../../src/ConfigSchema');
const Helper = require('../Helper/Helper');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */
  let container;

  /** @type {import('../Helper/Helper')} */
  let helper;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);
    helper = new Helper(container);
    const seq = container.resolve('sequelize');

    const { User } = seq.models;
    await User.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('graphql show profile of user', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'maryhelper',
      'maryhelper@gmail.com',
      'SA',
      [1],
    );
    await helper.CreateUserHeaderAndToken(
      'forlistcheck',
      'forlistcheck@gmail.com',
      'CL',
      [1],
    );

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    const graphQLEndpoint = fastify.baseURL('/graphql/graphql');

    const data1 = await fastify.inject({
      headers: {
        cookie: `${container.resolve('Config').ASM_AUTH_COOKIE}=${token}`,
      },
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `query(
            $lastSeen: Int,
            $limit: Int,
            $filter: JSON
          ) {
            UserList(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              }
            ) { docs { id username email role }}
          }`,
        variables: {
          limit: 5,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    console.log('+++++++++++++++++++++++=');
    console.log(data.UserList);
  });
});
