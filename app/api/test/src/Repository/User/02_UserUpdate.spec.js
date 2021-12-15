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

    const { User, UserProject, Project, Domain } = seq.models;
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

    await Domain.destroy({
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

  it('update user', async () => {
    const user = container.resolve('UserUpdateRepository');
    const createUser = container.resolve('UserCreateRepository');
    const createProject = container.resolve('ProjectCreateRepository');
    const createDomain = container.resolve('DomainCreateRepository');

    const user1 = await createUser.addUser({
      username: 'heytester',
      email: 'heytester@gmail.com',
      password: 'a1asQW12!@AS*&',
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
      username: 'heytester2',
      email: 'heyteste2@gmail.com',
      password: 'a1asQW12!@AS*&',
      role: 'CL',
      lang: 'en',
      options: [1],
      additional: {
        gender: 'female',
      },
    });

    const project1 = await createProject.addProject({
      title: 'its test for enable mood',
      publicToken: '1236s5721',
      options: [1],
      userAndRules: [
        {
          UserId: user1.dataValues.id,
          rules: ['ALL', 'VIEW_A'],
        },
      ],
      additional: {},
    });

    await createProject.addProject({
      title: 'its test',
      publicToken: '1236s5730',
      options: [2],
      userAndRules: [
        {
          UserId: user2.dataValues.id,
          rules: ['ALL'],
        },
        {
          UserId: user1.dataValues.id,
          rules: ['ALL'],
        },
      ],
      additional: {},
    });

    const project3 = await createProject.addProject({
      title: 'its test hey',
      publicToken: '1236s5asd',
      options: [1],
      userAndRules: [
        {
          UserId: user2.dataValues.id,
          rules: ['ALL'],
        },
      ],
      additional: {},
    });

    expect(
      await createDomain.addDomain({
        domain: 'forupdate.com',
        wildcardDomain: '',
        description: 'for update',
        options: [1],
        projectId: project1.id,
        additional: {
          alexaRank: '21',
        },
      }),
    ).toBeTruthy();

    expect(
      await createDomain.addDomain({
        domain: 'dontbe.com',
        wildcardDomain: '',
        description: 'for dontbe update',
        options: [1],
        projectId: project3.id,
        additional: {
          alexaRank: '40',
        },
      }),
    ).toBeTruthy();

    expect(
      await user.updateUserBySuperAdmin(user1.dataValues.id, {
        username: 'heymary',
        email: 'heymary@gmail.com',
        role: 'AD',
        lang: 'fa',
        options: {
          ACTIVE: false,
          DELETED: true,
        },
        country: 'IR',
        mobile: '09017744145',
        additional: {
          gender: 'other',
        },
      }),
    ).toBeTruthy();

    expect(
      await user.updateUserBySuperAdmin(user2.dataValues.id, {
        username: 'noupdatefield',
        email: 'noupdate@gmail.com',
        role: 'SA',
        lang: 'en',
        options: {
          ACTIVE: true,
          DELETED: false,
        },
        country: 'IR',
        mobile: '09336314586',
        additional: {
          gender: 'robots',
        },
      }),
    ).toBeTruthy();

    expect(
      await user.updateUserByMembers(user2.dataValues.id, {
        username: 'register',
        email: 'heytestr2@gmail.com',
        lang: 'en',
        country: 'IR',
        mobile: '09017744178',
        additional: {
          gender: 'male',
        },
      }),
    ).toBeTruthy();

    await expect(
      user.updateUserByMembers(user2.dataValues.id, {
        username: '+',
        email: 'heytester2@gmail.com',
        lang: 'en',
        country: 'IR',
        mobile: '09017744178',
        additional: {
          gender: 'male',
        },
      }),
    ).rejects.toThrowError();

    await expect(
      user.updateUserByMembers(user2.dataValues.id, {
        username: 'register',
        email: 'heytester2@gmail.com',
        lang: 'en',
        country: 'IR',
        mobile: '98',
        additional: {
          gender: 'male',
        },
      }),
    ).rejects.toThrowError();

    expect(
      await user.patchUserOptions(user2.dataValues.id, {
        ACTIVE: false,
        DELETED: true,
      }),
    ).toBeTruthy();

    expect(
      await user.retrieveUserOptions(user2.dataValues.id, {
        ACTIVE: false,
        DELETED: false,
      }),
    ).toStrictEqual([]);

    await expect(user.retrieveUserOptions(null, {})).rejects.toThrowError();
    await expect(user.updateUserBySuperAdmin(null, {})).rejects.toThrowError();
    await expect(user.updateUserByMembers(null, {})).rejects.toThrowError();
    await expect(user.patchUserOptions(null, {})).rejects.toThrowError();
  });
});
