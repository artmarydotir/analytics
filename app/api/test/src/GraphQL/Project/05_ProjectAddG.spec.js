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

    const { User, Project, UserProject } = seq.models;
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

  it('graphql add project', async () => {
    const { token } = await helper.CreateUserHeaderAndToken(
      'maryhelper',
      'maryhelper@gmail.com',
      'SA',
      [1],
    );
    const createUser = container.resolve('UserCreateRepository');

    const user = await createUser.addUser({
      username: 'addproject',
      email: 'addproject@gmail.com',
      password: 'a1asQW12!@ASd',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744145',
    });

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
            $title: String!
            $description: String
            $userAndRules: [JSONObject]!
            $options: [Int]!
            $primaryOwner: Int!
          ) {
            ProjectCreate(
              data: {
                title: $title
                description: $description
                userAndRules: $userAndRules
                options: $options
                primaryOwner: $primaryOwner
              }
            )
          }
        `,
        variables: {
          title: 'test title',
          description: 'test description',
          userAndRules: [
            {
              UserId: user.dataValues.id,
              rules: ['VIEWALL'],
            },
          ],
          options: [1],
          primaryOwner: user.dataValues.id,
        },
      },
    });

    expect(data1.statusCode).toBe(200);

    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `
          mutation(
            $title: String!
            $description: String
            $userAndRules: [JSONObject]!
            $options: [Int]!
            $primaryOwner: Int!
          ) {
            ProjectCreate(
              data: {
                title: $title
                description: $description
                userAndRules: $userAndRules
                options: $options
                primaryOwner: $primaryOwner
              }
            )
          }
        `,
        variables: {
          title: 'test title',
          description: 'test description',
          userAndRules: [
            {
              UserId: user.dataValues.id,
              rules: ['VIEWALL'],
            },
          ],
          options: [1],
          primaryOwner: user.dataValues.id,
        },
      },
    });

    const { errors } = JSON.parse(data2.body);

    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
