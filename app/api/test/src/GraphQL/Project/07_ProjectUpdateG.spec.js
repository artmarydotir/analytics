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

  it('graphql update project', async () => {
    const { token, user } = await helper.CreateUserHeaderAndToken(
      'maryhelper',
      'maryhelper@gmail.com',
      'SA',
      [1],
    );
    const { project } = await helper.CreateProject();

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
            $data: InputProjectUpdate
          ) {
            ProjectUpdate(
                id: $id,
                data: $data
            )
          }
        `,
        variables: {
          id: project.id,
          data: {
            title: 'updatedyou',
            description: 'hey sample helper',
            userAndRules: [
              {
                UserId: user.dataValues.id,
                rules: ['VIEWALL', 'PROJECTADMIN'],
              },
            ],
            options: {
              ACTIVE: false,
              DELETED: true,
            },
            primaryOwner: user.id,
          },
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
            $id: Int!
            $data: InputProjectUpdate
          ) {
            ProjectUpdate(
                id: $id,
                data: $data
            )
          }
        `,
        variables: {
          id: project.id,
        },
      },
    });

    const { errors } = JSON.parse(data2.body);

    expect(errors['0'].extensions.statusCode).toEqual(405);
  });
});
