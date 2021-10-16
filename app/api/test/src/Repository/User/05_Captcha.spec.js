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
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
    await container.resolve('Redis').quit();
  });

  it('get new captcha', async () => {
    const redis = await container.resolve('Redis');
    const red = await redis.getRedis();

    const captcha = container.resolve('CaptchaRepository');
    const u = await captcha.generateCaptcha();
    expect(u).toBeTruthy();

    const currentValue = await red.get(`captcha:${u.id}`);

    const b = await captcha.solveCaptcha(u.id, currentValue);
    expect(b).toBeTruthy();

    await expect(captcha.solveCaptcha()).rejects.toThrowError();
  });
});
