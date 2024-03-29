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

    await User.destroy({
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
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await container.dispose();
  });

  it('show list', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
    const createUser = container.resolve('UserCreateRepository');
    const createDomain = container.resolve('DomainCreateRepository');

    const enableUser = await createUser.addUser({
      username: 'enableuser',
      email: 'enableuser@gmail.com',
      password: 'a1asQW1d2!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744147',
    });

    const enableProject = await createProject.addProject({
      title: 'my project for list',
      publicToken: 'project00080',
      options: [1],
      description: 'hello test for list',
      primaryOwner: enableUser.id,
      userAndRules: [
        {
          UserId: enableUser.dataValues.id,
          rules: ['VIEWALL', 'PROJECTADMIN'],
        },
      ],
    });

    await createDomain.addDomain({
      domain: 'enabledomain.com',
      wildcardDomain: '',
      description: 'enable domain there for list',
      options: [1],
      projectId: enableProject.id,
    });

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    container.resolve('ProjectListREST');

    const url = fastify.openAPIBaseURL(
      `/collector/project-list?t=${encodeURIComponent(
        container.resolve('Config').ASM_COLLECTOR_API_KEY,
      )}`,
    );

    const result2 = await fastify.inject({
      url,
      method: 'GET',
    });

    expect(result2.statusCode).toEqual(200);
  });
});
