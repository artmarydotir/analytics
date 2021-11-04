/* eslint-env jest */

// @ts-ignore
require('../../../globals');

const { initContainer } = require('../../../src/Container');
const { Config } = require('../../../src/Config');
const { ConfigSchema } = require('../../../src/ConfigSchema');
const Helper = require('../Helper/Helper');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */
  let container;

  /** @type {import('../Helper/Helper')} */
  let helper;

  beforeAll(async () => {
    const config = new Config(ConfigSchema, {});
    container = await initContainer(config);
    helper = new Helper(container);
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

  // Rest test unit
  it('reset password and get hash', async () => {
    const { user } = await helper.CreateUserHeaderAndToken(
      'maryhelper',
      'maryhelper@gmail.com',
      'SA',
      [1],
    );

    const forgetPass = container.resolve('UserForgotPasswordRepository');

    const hashToken = await forgetPass.sendForgotPasswordCode(user.email);

    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    container.resolve('ResetPasswordREST');
    const resetURL = fastify.openAPIBaseURL('/user/reset-password');

    const result2 = await fastify.inject({
      url: resetURL,
      method: 'POST',
      payload: {
        token: hashToken,
        password: '!c9pc$GHPPGpx8EC',
      },
    });

    expect(result2.statusCode).toEqual(200);
  });
});
