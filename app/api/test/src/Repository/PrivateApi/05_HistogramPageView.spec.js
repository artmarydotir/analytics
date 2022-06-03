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

  it('Get histogram Count page views - session - users', async () => {
    const pvCount = container.resolve('HistogramPageViewRepository');

    const time = new Date();
    // time.setHours(time.getHours() - 5);
    time.setDate(time.getDate() - 94);
    const result = await pvCount.getHistogramPageView({
      publicToken: 'project00001',
      types: ['PageView', 'Users', 'Sessions'],
      startDate: time.toISOString(),
    });

    console.log(result);
  });
});
