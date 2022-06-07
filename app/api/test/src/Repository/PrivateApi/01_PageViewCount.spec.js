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

  it('Count page views - session - users', async () => {
    const pvCount = container.resolve('PageViewCountRepository');

    const time = new Date();
    time.setDate(time.getDate() - 28);
    const result = await pvCount.getPageViewCount({
      publicToken: 'project00001',
      types: ['Users', 'Sessions', 'PageView'],
      startDate: time.toISOString(),
    });

    expect(result).toBeTruthy();

    expect(result.result.Users).toBeTruthy();
    expect(result.query.publicToken).toBe('project00001');

    // catch error
    await expect(
      pvCount.getPageViewCount({
        types: [],
      }),
    ).rejects.toThrowError();
  });
});
