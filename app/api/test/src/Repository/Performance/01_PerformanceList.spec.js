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

  it('fetch Performance list', async () => {
    const createPerformance = container.resolve('PerformanceCreateRepository');

    const performList = container.resolve('PerformanceListRepository');

    expect(
      await createPerformance.addPerformance({
        name: 'heyperform',
        url: 'https://jacynthe.biz/',
        description: 'i can be a description',
        interval: 6,
        options: [1],
      }),
    ).toBeTruthy();

    const b = await performList.fetchPerformanceList({
      limit: 20,
      lastSeen: undefined,
      filter: {
        arrIn_options: [1],
        like_url: 'jacynthe.biz',
        dte_createdAt: new Date(),
      },
    });

    expect(b).toBeTruthy();

    expect(b).toBeTruthy();
  });
});
