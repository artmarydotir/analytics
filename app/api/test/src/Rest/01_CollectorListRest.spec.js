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
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('show list', async () => {
    /** @type {import('fastify').FastifyInstance} */
    const fastify = container.resolve('Fastify').getFastify();

    container.resolve('ProjectListREST');

    const url = fastify.openAPIBaseURL('/collector/project-list');

    const result1 = await fastify.inject({
      url,
      method: 'GET',
    });

    expect(result1.statusCode).toEqual(403);

    const result2 = await fastify.inject({
      url,
      method: 'GET',
      headers: {
        'x-collector-api-key': `${
          container.resolve('Config').ASM_COLLECTOR_API_KEY
        }`,
      },
      payload: {},
    });

    expect(result2.statusCode).toEqual(200);
  });
});
