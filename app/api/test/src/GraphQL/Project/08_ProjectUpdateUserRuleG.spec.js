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
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await container.dispose();
  });

  it('graphql update project user rules', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'maryhelper',
      'maryhelper@gmail.com',
      'CL',
      [1],
    );
    const createUser = container.resolve('UserCreateRepository');
    const createProject = container.resolve('ProjectCreateRepository');
    const user2 = await createUser.addUser({
      username: 'anotherclient',
      email: 'anotherclient@gmail.com',
      password: 'a1asQW12!@ASd',
      role: 'CL',
      lang: 'fa',
      options: [1],
    });

    const project = await createProject.addProject({
      title: 'for access test',
      description: 'hey hello',
      userAndRules: [
        {
          UserId: user.id,
          rules: ['PROJECTADMIN'],
        },
      ],
      primaryOwner: user.id,
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
        query: `mutation (
          $projectId: Int!
          $userAndRules: [JSONObject]!
            ) {
            ProjectUpdateUserRules(
              data: {
                projectId: $projectId
                userAndRules: $userAndRules
              }
            )
        }
        `,
        variables: {
          projectId: project.id,
          userAndRules: [
            {
              UserId: user2.id,
              rules: ['VIEWALL', 'PROJECTADMIN'],
            },
            {
              UserId: user.id,
              rules: ['PROJECTADMIN'],
            },
          ],
        },
      },
    });

    expect(data1.statusCode).toBe(200);

    const data2 = await fastify.inject({
      url: graphQLEndpoint,
      method: 'POST',
      payload: {
        operationName: null,
        query: `mutation (
          $projectId: Int!
          $userAndRules: [JSONObject]!
            ) {
            ProjectUpdateUserRules(
              data: {
                projectId: $projectId
                userAndRules: $userAndRules
              }
            )
        }
        `,
        variables: {
          projectId: project.id,
          userAndRules: [
            {
              UserId: user2.id,
              rules: ['VIEWALL', 'PROJECTADMIN'],
            },
            {
              UserId: user.id,
              rules: ['PROJECTADMIN'],
            },
          ],
        },
      },
    });
    const { errors } = JSON.parse(data2.body);

    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
