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

  it('add project', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
    const updateProject = container.resolve('ProjectUpdateRepository');
    const createDomain = container.resolve('DomainCreateRepository');

    const createUser = container.resolve('UserCreateRepository');
    const user = await createUser.addUser({
      username: 'addproject',
      email: 'addproject@gmail.com',
      password: 'a1asQW12!@AS',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744145',
    });

    const user2 = await createUser.addUser({
      username: 'addproject2',
      email: 'addproject2@gmail.com',
      password: 'a1asQW12!@AS',
      role: 'SA',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744148',
    });

    const res = await createProject.addProject({
      title: 'donyaye Eghtesad',
      publicToken: '123654',
      description: 'hey hello',
      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['VIEWALL'],
        },
      ],
      primaryOwner: user.id,
    });

    const res2 = await createProject.addProject({
      title: 'analytic',
      publicToken: '12365468',
      description: 'hey htm',
      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['VIEWALL'],
        },
      ],
      primaryOwner: user.dataValues.id,
    });

    expect(
      await updateProject.patchProjectOptions(res.id, {
        ACTIVE: true,
        DELETED: false,
      }),
    ).toBeTruthy();

    expect(
      await createDomain.addDomain({
        domain: 'check.com',
        wildcardDomain: '',
        description: 'new domain same projects',
        options: [1],
        projectId: res.id,
      }),
    ).toBeTruthy();

    expect(
      await createDomain.addDomain({
        domain: 'mary.com',
        wildcardDomain: '',
        description: 'new domain same project',
        options: [1],
        projectId: res.id,
      }),
    ).toBeTruthy();

    expect(
      await createDomain.addDomain({
        domain: 'notrelated.com',
        wildcardDomain: '',
        description: 'new domain same project',
        options: [1],
        projectId: res2.id,
      }),
    ).toBeTruthy();

    expect(
      await updateProject.updateProject(res.id, {
        title: 'mosals news',
        description: 'will change you',

        options: {
          ACTIVE: true,
          DELETED: true,
        },
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['VIEWALL'],
          },
          {
            UserId: user2.dataValues.id,
            rules: ['VIEWALL', 'PROJECTADMIN'],
          },
        ],
        primaryOwner: user.dataValues.id,
      }),
    ).toBeTruthy();

    await expect(updateProject.updateProject(null, {})).rejects.toThrowError();
    await expect(
      updateProject.updateProject(res.id, {
        title: null,
        description: 'will change you too',
        options: {
          ACTIVE: false,
          DELETED: true,
        },
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['VIEWALL', 'PROJECTADMIN'],
          },
          {
            UserId: user2.dataValues.id,
            rules: ['VIEWALL', 'PROJECTADMIN'],
          },
        ],
      }),
    ).rejects.toThrowError();

    await expect(
      updateProject.updateProject(res.id, {
        title: null,
        description: 'will change you too',
        options: {
          ACTIVE: true,
          DELETED: false,
        },
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['VIEWALL', 'PROJECTADMIN'],
          },
          {
            UserId: user2.dataValues.id,
            rules: ['VIEWALL', 'PROJECTADMIN'],
          },
        ],
      }),
    ).rejects.toThrowError();

    await expect(
      updateProject.patchProjectOptions(null, {}),
    ).rejects.toThrowError();

    const b = await updateProject.patchProjectOptions(res.id, {
      ACTIVE: true,
      DELETED: false,
    });
    expect(b.projectId).toBe(res.id);

    await expect(
      updateProject.retrieveProjectOptions(null, {}),
    ).rejects.toThrowError();
  });
});
