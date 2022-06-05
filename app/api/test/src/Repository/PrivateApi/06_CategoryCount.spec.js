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

  it('Get Category count', async () => {
    const categoryCount = container.resolve('CategoryCountRepository');

    const time = new Date();
    time.setDate(time.getDate() - 150);
    const result = await categoryCount.getCategoryCount({
      publicToken: 'project00001',
      // startDate: time.toISOString(),
      limit: 200,
    });

    console.log(result);
  });
});
