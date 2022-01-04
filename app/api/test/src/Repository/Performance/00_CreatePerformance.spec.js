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
    const seq = container.resolve('sequelize');

    const { Performance } = seq.models;
    await Performance.destroy({
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

  it('add Performance', async () => {
    const createPerformance = container.resolve('PerformanceCreateRepository');

    expect(
      await createPerformance.addPerformance({
        name: 'heyperform',
        url: 'https://jacynthe.biz/',
        description: 'i can be a description',
        interval: 6,
        options: [1],
      }),
    ).toBeTruthy();

    await expect(
      createPerformance.addPerformance({
        name: 'heysdfperform',
        options: [1],
        ping: true,
      }),
    ).rejects.toThrowError();
  });
});
