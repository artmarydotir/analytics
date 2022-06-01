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
  });

  it('Get referer data', async () => {
    const top = container.resolve('TopUrlsRepository');

    const a = new Date();
    a.setDate(a.getDate() - 24);

    const r = await top.getTopUrls({
      publicToken: 'project00001',
      type: 'URL', // OR CanonicalURL
      startDate: a.toISOString(),
      limit: 30,
    });

    expect(r.result).toBeInstanceOf(Array);
  });
});
