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

  it('add user and forget password check', async () => {
    const createUser = container.resolve('UserCreateRepository');
    const forgetPass = container.resolve('UserForgotPasswordRepository');

    await createUser.addUser({
      username: 'heymary',
      email: 'heymary@gmail.com',
      password: 'a1asQW12!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744145',
    });

    await expect(forgetPass.sendForgotPasswordCode()).rejects.toThrowError();

    expect(
      await forgetPass.sendForgotPasswordCode('heymary@gmail.com'),
    ).toBeTruthy();
  });
});
