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
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('fetch project list', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
    const createUser = container.resolve('UserCreateRepository');
    const createDomain = container.resolve('DomainCreateRepository');
    const projectList = container.resolve('ProjectListRepository');

    const userData = await createUser.addUser({
      username: 'forlist',
      email: 'forlist@gmail.com',
      password: 'a1asQW12!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744147',
      additional: {
        gender: 'female',
      },
    });

    const projectData = await createProject.addProject({
      title: 'my project for list',
      publicToken: 'project00001',
      description: 'hello test for list',
      userAndRoles: [
        {
          UserId: userData.dataValues.id,
          role: ['ALL', 'VIEW_B'],
        },
      ],
      additional: {},
    });

    await createDomain.addDomain({
      domain: 'forlist.com',
      wildcardDomain: '',
      description: 'there for list',
      options: [1],
      projectId: projectData.id,
      additional: {
        alexaRank: '21',
      },
    });

    await createDomain.addDomain({
      domain: '',
      wildcardDomain: '*.mine.tld',
      description: 'there for list',
      options: [1],
      projectId: projectData.id,
      additional: {
        alexaRank: '10',
      },
    });

    expect(await projectList.getProjectDomainList()).toBeTruthy();
  });
});
