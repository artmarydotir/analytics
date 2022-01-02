/* eslint-env jest */

// @ts-ignore
require('../../../globals');

const { initContainer } = require('../../../src/Container');
const { Config } = require('../../../src/Config');
const { ConfigSchema } = require('../../../src/ConfigSchema');

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
    await container.resolve('Redis').quit();
  });

  it('sign in', async () => {
    const createUser = container.resolve('UserCreateRepository');
    const auth = container.resolve('UserAuthRepository');
    const captcha = container.resolve('CaptchaRepository');
    const capResult = await captcha.generateCaptcha();
    const redis = await container.resolve('Redis');
    const red = await redis.getRedis();

    const userData = {
      username: 'tokenuser',
      email: 'tokenuser@gmail.com',
      password: 'a1asQW1d2!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744147',
    };

    await createUser.addUser(userData);

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    container.resolve('AuthREST');
    const loginURL = fastify.openAPIBaseURL('/user/auth/login');
    const refreshURL = fastify.openAPIBaseURL('/user/auth/refresh');

    const result1 = await fastify.inject({
      url: loginURL,
      method: 'POST',
      payload: {
        type: 'AP',
        remember: false,
        data: {
          email: userData.email,
          password: userData.password,
          captcha: {
            id: capResult.id,
            value: await red.get(`captcha:${capResult.id}`),
          },
        },
      },
    });

    expect(result1.statusCode).toEqual(200);

    console.log(container.resolve('Config').ASM_AUTH_REFRESH_COOKIE);
    // console.log(result1.headers);

    const [, { value: AuthRefreshToken }] = result1.cookies;

    // const allCookie = result1.cookies;
    // const b = allCookie.find((x) => x.name === 'AuthToken');
    // console.log(b);

    const result2 = await fastify.inject({
      url: refreshURL,
      method: 'GET',
      headers: {
        cookie: `${
          container.resolve('Config').ASM_AUTH_REFRESH_COOKIE
        }=${AuthRefreshToken};`,
      },
      payload: {},
    });

    console.log(result2.headers);
  });
});
