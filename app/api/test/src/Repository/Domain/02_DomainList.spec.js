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

  it('fetch domain list', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
    const createUser = container.resolve('UserCreateRepository');
    const createDomain = container.resolve('DomainCreateRepository');
    const domainList = container.resolve('DomainListRepository');
    const updateProject = container.resolve('ProjectUpdateRepository');

    const enableUser = await createUser.addUser({
      username: 'enableuser',
      email: 'enableuser@gmail.com',
      password: 'a1asQW1d2!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744147',
      additional: {
        gender: 'female',
      },
    });

    const disableUser = await createUser.addUser({
      username: 'disableuser',
      email: 'disableuser@gmail.com',
      password: 'ba1asQW12!@AS*&',
      role: 'SA',
      lang: 'en',
      options: [1, 2],
      country: 'IR',
      mobile: '09017744148',
      additional: {
        gender: 'male',
      },
    });

    const enableProject = await createProject.addProject({
      title: 'my project for list',
      publicToken: 'project00080',
      options: [1],
      description: 'hello test for list',
      userAndRoles: [
        {
          UserId: enableUser.dataValues.id,
          role: ['ALL', 'VIEW_B'],
        },
      ],
      additional: {},
    });

    const disableProject = await createProject.addProject({
      title: 'my disable project',
      publicToken: 'project00090',
      description: 'hello test for list',
      options: [1, 2],
      userAndRoles: [
        {
          UserId: disableUser.dataValues.id,
          role: ['ALL', 'VIEW_B'],
        },
      ],
      additional: {},
    });

    await createDomain.addDomain({
      domain: 'enabledomain.com',
      wildcardDomain: '',
      description: 'enable domain there for list',
      options: [1],
      projectId: enableProject.id,
      additional: {
        alexaRank: '21',
      },
    });

    await createDomain.addDomain({
      domain: 'disabledomain.com',
      wildcardDomain: '',
      description: 'disable domain there for list',
      options: [2],
      projectId: enableProject.id,
      additional: {
        alexaRank: '21',
      },
    });

    await createDomain.addDomain({
      domain: 'domainwithdisableproject.com',
      wildcardDomain: '',
      description: 'there for list',
      options: [1],
      projectId: disableProject.id,
      additional: {
        alexaRank: '21',
      },
    });

    await createDomain.addDomain({
      domain: '',
      wildcardDomain: '*.mine.tld',
      description: 'there for list',
      options: [1],
      projectId: enableProject.id,
      additional: {
        alexaRank: '10',
      },
    });

    expect(
      await updateProject.patchProjectOptions(2, {
        ACTIVE: false,
        DELETED: true,
      }),
    ).toBeTruthy();

    const b = await domainList.fetchDomainList({
      limit: 40,
      filter: {
        arrIn_options: [1],
      },
    });

    expect(b).toBeTruthy();
  });
});
