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
    const config = new Config(ConfigSchema, {
      // ASM_PUBLIC_APP_TEST: true,
    });
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

  it('graphql request for forgot password hash', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'maryhelper',
      'maryhelper@gmail.com',
      'SA',
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

        query: `query ($email: EmailAddress!) {
          UserForgotPassword(
            data: {
              email: $email
            }
          )
      }`,
        variables: {
          email: user.email,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.UserForgotPassword).toBeTruthy();
  });
});
