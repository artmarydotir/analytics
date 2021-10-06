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
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('add project', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
    const updateProject = container.resolve('ProjectUpdateRepository');

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
      additional: {
        gender: 'female',
      },
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
      additional: {
        gender: 'female',
      },
    });

    const res = await createProject.addProject({
      title: 'donyaye Eghtesad',
      publicToken: '123654',
      description: 'hey hello',
      userAndRoles: [
        {
          UserId: user.dataValues.id,
          role: ['ALL', 'VIEW_A'],
        },
      ],
      additional: {},
    });

    expect(
      await updateProject.patchProjectOptions(res.id, {
        ACTIVE: true,
        DELETED: false,
      }),
    ).toBeTruthy();

    expect(
      await updateProject.updateProject(res.id, {
        title: 'mosals news',
        description: 'will change you too',
        publicToken: '123654a1s2',
        additional: {
          officeLocation: 'tehran',
        },
        options: {
          ACTIVE: true,
          DELETED: false,
        },
        userAndRoles: [
          {
            UserId: user.dataValues.id,
            role: ['ALL', 'VIEW_C'],
          },
          {
            UserId: user2.dataValues.id,
            role: ['NEWS_A'],
          },
        ],
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
        userAndRoles: [
          {
            UserId: user.dataValues.id,
            role: ['ALL', 'VIEW_C'],
          },
          {
            UserId: user2.dataValues.id,
            role: ['NEWS_A'],
          },
        ],
      }),
    ).rejects.toThrowError();

    await expect(
      updateProject.patchProjectOptions(null, {}),
    ).rejects.toThrowError();

    await expect(
      updateProject.retrieveProjectOptions(null, {}),
    ).rejects.toThrowError();
  });
});
