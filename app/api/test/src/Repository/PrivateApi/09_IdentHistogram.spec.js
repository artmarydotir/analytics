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
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await container.dispose();
  });

  it('Get Action count', async () => {
    const identHistogram = container.resolve('IdentHistogramRepository');

    const time = new Date();
    time.setDate(time.getDate() - 150);
    const result = await identHistogram.getEIdentHistogram({
      publicToken: 'project00001',
      category: 'video',
      action: 'update',
      id: '590',
      // startDate: time.toISOString(),
    });

    expect(result.result).toBeInstanceOf(Array);
  });
});
