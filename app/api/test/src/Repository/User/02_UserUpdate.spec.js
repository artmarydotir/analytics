/* eslint-env jest */

// @ts-ignore
require('../../../../globals');

const { initContainer } = require('../../../../src/Container');
const { Config } = require('../../../../src/Config');
const { ConfigSchema } = require('../../../../src/ConfigSchema');
const { list: projectRule } = require('../../../../src/Schema/ProjectRules');

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
      username: 'updatetest1',
      email: 'updatetest@gmail.com',
      password: 'a1asQW12!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744145',
    });

    const user2 = await createUser.addUser({
      username: 'heytester2',
      email: 'heyteste2@gmail.com',
      password: 'a1asQW12!@AS*&',
      role: 'CL',
      lang: 'en',
      options: [1],
    });

    const user3 = await createUser.addUser({
      username: 'formembers',
      // eslint-disable-next-line sonarjs/no-duplicate-string
      email: 'formembers@gmail.com',
      password: 'a8asQW12!@AS*&',
      role: 'CL',
      lang: 'en',
      options: [1],
    });

    const project1 = await createProject.addProject({
      title: 'my primaryowner is user1',
      publicToken: '1236s5721',
      options: [1],
      primaryOwner: user1.id,
      userAndRules: [
        {
          UserId: user2.dataValues.id,
          rules: projectRule,
        },
      ],
    });

    const project2 = await createProject.addProject({
      title: 'its test',
      publicToken: '1236s5730',
      primaryOwner: user2.id,
      options: [1],
      userAndRules: [
        {
          UserId: user1.dataValues.id,
          rules: [projectRule[1]],
        },
      ],
    });

    expect(
      await createDomain.addDomain({
        domain: 'forupdate.com',
        wildcardDomain: '',
        description: 'for update',
        options: [1],
        projectId: project1.id,
      }),
    ).toBeTruthy();

    expect(
      await createDomain.addDomain({
        domain: 'dontbe.com',
        wildcardDomain: '',
        description: 'for dontbe update',
        options: [1],
        projectId: project2.id,
      }),
    ).toBeTruthy();

    // Update user by admins
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
      }),
    ).toBeTruthy();

    expect(
      await user.updateUserBySuperAdmin(user2.dataValues.id, {
        username: 'heytester2',
        email: 'heyteste2@gmail.com',
        role: 'CL',
        lang: 'fa',
        options: {
          ACTIVE: true,
          DELETED: false,
        },
        country: 'IR',
        mobile: '09017744145',
      }),
    ).toBeTruthy();

    // Get Project Belonging to User
    expect(
      await user.getProjectListBelongsUser(user2.dataValues.id),
    ).toBeTruthy();

    // Patch user options
    expect(
      await user.patchUserOptions(user3.dataValues.id, {
        ACTIVE: true,
        DELETED: false,
      }),
    ).toBeTruthy();

    // Update user by member(Profile update)
    expect(
      await user.updateUserByMembers(user3.dataValues.id, {
        username: 'formembersedit',
        email: 'formembers@gmail.com',
        lang: 'en',
        country: 'IR',
        mobile: '09017744178',
      }),
    ).toBeTruthy();

    await expect(
      user.updateUserByMembers(user3.dataValues.id, {
        username: '+',
        email: 'formembers@gmail.com',
        lang: 'en',
        country: 'IR',
        mobile: '09017744178',
      }),
    ).rejects.toThrowError();

    await expect(
      user.updateUserByMembers(user3.dataValues.id, {
        username: 'formembers',
        email: 'formembers@gmail.com',
        lang: 'en',
        country: 'IR',
        mobile: '98',
      }),
    ).rejects.toThrowError();

    // Retrieve user options
    expect(
      await user.retrieveUserOptions(user3.dataValues.id, {
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
