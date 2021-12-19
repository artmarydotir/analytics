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

  it('add user', async () => {
    const createUser = container.resolve('UserCreateRepository');
    const otp = container.resolve('OtpGeneratorRepository');

    const user = await createUser.addUser({
      username: 'heymary',
      email: 'heymary@gmail.com',
      password: 'a1asQW12!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
    });

    await expect(otp.generateNewOtp()).rejects.toThrowError();
    await expect(
      otp.generateNewOtp(user.id, 'imsowrong!@AS'),
    ).rejects.toThrowError();
    expect(await otp.generateNewOtp(user.id, 'a1asQW12!@AS*&')).toBeTruthy();
  });
});
