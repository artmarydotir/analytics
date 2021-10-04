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

    const { User } = seq.models;
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
      role: 'VI',
      lang: 'en',
      options: [1],
      additional: {
        gender: 'female',
      },
    });

    expect(
      await user.updateUserBySuperAdmin(user1.dataValues.id, {
        username: 'heymary',
        email: 'heymary@gmail.com',
        role: 'AD',
        lang: 'fa',
        options: [1],
        country: 'IR',
        mobile: '09017744145',
        additional: {
          gender: 'other',
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

    expect(
      await user.patchUserOptions(user1.dataValues.id, {
        ACTIVE: false,
        DELETED: true,
      }),
    ).toBeTruthy();

    await expect(user.updateUserBySuperAdmin(null, {})).rejects.toThrowError();
    await expect(user.updateUserByMembers(null, {})).rejects.toThrowError();
    await expect(user.patchUserOptions(null, {})).rejects.toThrowError();

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
  });
});
