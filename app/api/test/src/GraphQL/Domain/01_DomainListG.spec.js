/* eslint-env jest */

// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');
const Helper = require('../../Helper/Helper');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */
  let container;

  /** @type {import('../../Helper/Helper')} */
  let helper;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);
    helper = new Helper(container);
    const seq = container.resolve('sequelize');

    const { User, Project, UserProject, Domain } = seq.models;
    await UserProject.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await Project.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await Domain.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await User.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await container.dispose();
  });

  it('graphql domain list', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'maryhelper',
      'maryhelper@gmail.com',
      'SA',
      [1],
    );

    await helper.CreateDomain();

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
        query(
            $lastSeen: Int,
            $limit: Int,
            $filter: JSON
          ) {
            DomainList(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              }
            ) { docs { id domain wildcardDomain options projectName } }
          }
        `,
        variables: {
          limit: 5,
        },
      },
    });

    const { data } = JSON.parse(data1.body);
    expect(data.DomainList.docs.length).toBeTruthy();

    // Not a valid token
    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
        query(
            $lastSeen: Int,
            $limit: Int,
            $filter: JSON
          ) {
            DomainList(
              args: {
                filter: $filter,
                limit: $limit,
                lastSeen: $lastSeen
              }
            ) { docs { id domain wildcardDomain options projectName } }
          }
        `,
        variables: {
          limit: 10,
        },
      },
    });
    const { errors } = JSON.parse(data2.body);

    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
