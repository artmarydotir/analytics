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
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await container.dispose();
  });

  it('create user and check existence', async () => {
    const createUser = container.resolve('UserCreateRepository');
    const process = container.resolve('UserProcessRepository');

    // const b = await process.generatePassword();

    // Add User
    const user = await createUser.addUser({
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'a1asQW12!@AS',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744145',
    });

    // Check UserExistAndActive
    expect(
      await process.isUserExistAndActive({
        username: user.dataValues.username,
        email: user.dataValues.email,
      }),
    ).toBe(true);
    expect(
      await process.isUserExistAndActive({
        username: '1',
      }),
    ).toBe(false);

    // Retrieve User ID
    expect(
      await process.returnActiveUserID({
        username: user.dataValues.username,
      }),
    ).toBeTruthy();

    await expect(
      process.returnActiveUserID({
        username: '1',
      }),
    ).rejects.toThrowError();

    // Retrieve ActiveUserDataByID
    expect(await process.returnActiveUserDataByID(user.id)).toBeTruthy();
    await expect(process.returnActiveUserDataByID(2500)).rejects.toThrowError();

    // Retrieve ActiveUserDataByUsername || Email
    expect(
      await process.returnActiveUserData({
        username: user.dataValues.username,
      }),
    ).toBeTruthy();

    await expect(
      process.returnActiveUserData({
        username: 'imnotexist',
      }),
    ).rejects.toThrowError();

    // Check User ExistNotOptionCheck
    expect(await process.userExistNotOptionCheck(user.id)).toBeTruthy();
    await expect(process.userExistNotOptionCheck(2500)).rejects.toThrowError();

    // Check User ExistByID
    expect(await process.isUserExistByID(user.id)).toBeTruthy();
    await expect(process.isUserExistByID(2500)).rejects.toThrowError();

    // Update password
    const { found, psw } = await process.setGeneratedPassword({
      username: user.dataValues.username,
    });

    expect(found).toBeTruthy();
    expect(psw).toBeTruthy();
  });

  it('Generating Password Check', async () => {
    const process = container.resolve('UserProcessRepository');

    expect(await process.generatePassword()).toBeTruthy();
  });
});
