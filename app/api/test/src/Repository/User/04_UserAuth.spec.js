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
    await container.resolve('Redis').quit();
  });

  it('add user', async () => {
    const createUser = container.resolve('UserCreateRepository');
    const authUser = container.resolve('UserAuthRepository');
    const captcha = container.resolve('CaptchaRepository');
    const capResult = await captcha.generateCaptcha();
    const redis = await container.resolve('Redis');
    const red = await redis.getRedis();

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

    await expect(
      authUser.signIn('AP', {
        email: 'mary@gmail.com',
        password: 'a',
        captcha: {
          id: capResult.id,
          value: await red.get(`captcha:${capResult.id}`),
        },
      }),
    ).rejects.toThrowError();

    const b = await authUser.signIn('AP', {
      email: 'heymary@gmail.com',
      password: 'a1asQW12!@AS*&',
      captcha: {
        id: capResult.id,
        value: await red.get(`captcha:${capResult.id}`),
      },
    });

    expect(b).toBeTruthy();
  });
});
