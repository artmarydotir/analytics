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
    const profile = container.resolve('ProjectProfileRepository');
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

    const user3 = await createUser.addUser({
      username: 'addprimary',
      email: 'addprimary@gmail.com',
      password: 'a1asQW12!@AS',
      role: 'SA',
      lang: 'fa',
      options: [1],
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

    const pData = await createProject.addProject({
      title: 'for profile test',
      description: 'hey hello',
      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['ALL'],
        },
        {
          UserId: user2.dataValues.id,
          rules: ['VIEW_A'],
        },
      ],
      primaryOwner: user3.dataValues.id,
      additional: {},
    });

    expect(
      await createProject.addProject({
        title: 'donyaye Eghtesad',
        publicToken: '123654',
        description: 'hey hello',
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['ALL', 'VIEW_A'],
          },
        ],
        primaryOwner: user3.dataValues.id,
        additional: {},
      }),
    ).toBeTruthy();

    await profile.returnProjectData(pData.id);

    // check later
    expect(await createProject.regeneratePrivateToken(pData.id)).toBeTruthy();

    expect(
      await createProject.addProject({
        title: 'test2',
        publicToken: '123654a1s2',
        description: 'hey hello',
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['ALL', 'VIEW_A'],
          },
          {
            UserId: user2.dataValues.id,
            rules: ['ALL', 'VIEW_A'],
          },
        ],
        primaryOwner: user.dataValues.id,
        additional: {},
      }),
    ).toBeTruthy();

    expect(
      await createProject.addProject({
        title: 'donyayeEf',
        description: 'hey this is a description',
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['ALL', 'VIEW_A'],
          },
        ],
        additional: {},
        primaryOwner: user.dataValues.id,
      }),
    ).toBeTruthy();

    await expect(
      createProject.addProject({
        title: 'donyayeEf',
        description: 'hey hello there',
        additional: {},
      }),
    ).rejects.toThrowError();

    await expect(
      createProject.addProject({
        description: 'hey hello there',
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['ALL', 'VIEW_A'],
          },
        ],
        primaryOwner: user.dataValues.id,
      }),
    ).rejects.toThrowError();
  });
});
