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
    const referer = container.resolve('RefererDataRepository');

    const a = new Date();
    a.setDate(a.getDate() - 58);

    const r = await referer.getRefererData({
      publicToken: 'project00001',
      refererType: 'SessionReferer', // OR 'PageViewReferer'
      startDate: a.toISOString(),
      limit: 30,
    });

    console.log(r);
    expect(r.result).toBeInstanceOf(Array);
  });
});
