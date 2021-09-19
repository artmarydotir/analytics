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

  it('create user and check exigency', async () => {
    const createUser = container.resolve('UserCreateRepository');
    const process = container.resolve('UserProcessRepository');

    // const b = await process.generatePassword();

    const user = await createUser.addUser({
      username: 'heychecker',
      email: 'heychecker@gmail.com',
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
      await process.isUserExistAndActive({
        username: user.dataValues.username,
        email: user.dataValues.email,
      }),
    ).toBe(true);

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

    expect(
      await process.isUserExistAndActive({
        username: '1',
      }),
    ).toBe(false);

    // update password
    const { found, generatedPassword } = await process.setGeneratedPassword({
      username: 'qqqqqqqqqqq',
    });
    console.log(found);
    console.log(generatedPassword);
  });

  it('password functionality check', async () => {
    const process = container.resolve('UserProcessRepository');

    expect(await process.generatePassword()).toBeTruthy();
  });
});
