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
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await container.dispose();
    await container.resolve('Redis').quit();
  });

  it('get captcha image and token', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    container.resolve('CaptchaREST');
    const captchaURL = fastify.openAPIBaseURL('/captcha');

    const result1 = await fastify.inject({
      url: captchaURL,
      method: 'GET',

      // add query params
      query: {
        lang: 'fa',
      },
    });

    expect(result1.statusCode).toEqual(200);
  });
});
