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

    expect(
      await createProject.addProject({
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
      }),
    ).toBeTruthy();

    expect(
      await createProject.addProject({
        title: 'donyayeEf',
        description: 'hey this is a description',
        userAndRoles: [
          {
            UserId: user.dataValues.id,
            role: ['ALL', 'VIEW_A'],
          },
        ],
        additional: {},
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
        userAndRoles: [
          {
            UserId: user.dataValues.id,
            role: ['ALL', 'VIEW_A'],
          },
        ],
      }),
    ).rejects.toThrowError();
  });
});
