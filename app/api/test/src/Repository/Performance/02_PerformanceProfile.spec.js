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
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await container.dispose();
  });

  it('fetch Performance profile', async () => {
    const createPerformance = container.resolve('PerformanceCreateRepository');
    const performProfile = container.resolve('PerformanceProfileRepository');

    const profile = await createPerformance.addPerformance({
      name: 'heyperform',
      url: 'https://jacynthe.biz/',
      description: 'i can be a description',
      interval: 6,
      options: [1],
    });

    const b = await performProfile.returnPerformanceData(profile.id);
    expect(b).toBeTruthy();

    await expect(performProfile.returnPerformanceData()).rejects.toThrowError();
    await expect(
      performProfile.returnPerformanceData(125),
    ).rejects.toThrowError();
  });
});
