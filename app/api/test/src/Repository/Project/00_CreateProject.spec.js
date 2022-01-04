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
      password: 'a1asQW12!@ASd',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744145',
    });

    const user2 = await createUser.addUser({
      username: 'addproject2',
      email: 'addproject2@gmail.com',
      password: 'a1asQW12!@ASq',
      role: 'SA',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744148',
    });

    const user3 = await createUser.addUser({
      username: 'addprimary',
      email: 'addprimary@gmail.com',
      password: 'l1asQW12!@AS',
      role: 'SA',
      lang: 'fa',
      options: [1],
    });

    // Create project
    const pData = await createProject.addProject({
      title: 'for profile test',
      description: 'hey hello',

      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['VIEWALL'],
        },
        {
          UserId: user2.dataValues.id,
          rules: ['VIEWALL'],
        },
      ],
      primaryOwner: user3.dataValues.id,
    });

    expect(
      await createProject.addProject({
        title: 'donyaye Eghtesad',
        publicToken: '123654',
        description: 'hey hello',
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['VIEWALL'],
          },
        ],
        primaryOwner: user3.dataValues.id,
      }),
    ).toBeTruthy();

    expect(
      await createProject.addProject({
        title: 'test2',
        publicToken: '123654a1s2',
        description: 'hey hello',
        options: [1],
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['PROJECTADMIN'],
          },
          {
            UserId: user2.dataValues.id,
            rules: ['PROJECTADMIN'],
          },
        ],
        primaryOwner: user.dataValues.id,
      }),
    ).toBeTruthy();

    expect(
      await createProject.addProject({
        title: 'maryychecjkkk',
        description: 'hey this is a description',
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['VIEWALL', 'PROJECTADMIN'],
          },
        ],
        primaryOwner: user.dataValues.id,
      }),
    ).toBeTruthy();

    await expect(
      createProject.addProject({
        title: 'donyayeEf',
        description: 'hey hello there',
      }),
    ).rejects.toThrowError();

    await expect(
      createProject.addProject({
        title: 'notvalid',
        userAndRules: [
          {
            UserId: user.dataValues.id,
            rules: ['IMNOTVALID'],
          },
        ],
        primaryOwner: user.dataValues.id,
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

    // Retrieve project Data
    await profile.returnProjectData(pData.id);

    // Generate Private Token
    expect(await createProject.regeneratePrivateToken(pData.id)).toBeTruthy();
    await expect(createProject.regeneratePrivateToken()).rejects.toThrowError();
  });
});
