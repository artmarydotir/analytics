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

  // it should add a user
  it('graphql add user endpoint', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
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
        query: `
          mutation(
            $id: Int!
            $username: String
            $email: EmailAddress
            $password: String
            $role: String
            $lang: String
            $country: String
            $mobile: String
            $options: JSON
          ) {
            UserUpdate(
              data: {
                $id: $id
                info: {
                  username: $username
                  email: $email
                  password: $password
                  role: $role
                  lang: $lang
                  country: $country
                  mobile: $mobile
                  options: $options
                }
              }
            )
          }
        `,
        variables: {
          id: 1,
          info: {
            lang: 'en',
            role: 'VI',
          },
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.UserCreate.username).toEqual('testusername');
  });
});
