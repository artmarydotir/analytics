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

  it('update performance', async () => {
    const createPerformance = container.resolve('PerformanceCreateRepository');
    const performUpdate = container.resolve('PerformanceUpdateRepository');

    const profile = await createPerformance.addPerformance({
      name: 'heyperform',
      url: 'https://jacynthe.biz/',
      description: 'i can be a description',
      interval: 6,
      options: [1],
    });

    const b = await performUpdate.updatePerformance(profile.id, {
      name: 'heyperform2',
      url: 'https://jac.biz',
      interval: 4,
      options: {
        ACTIVE: false,
        DELETED: true,
      },
    });
    expect(b).toBeTruthy();

    await expect(
      performUpdate.updatePerformance(null, {}),
    ).rejects.toThrowError();
    await expect(
      performUpdate.updatePerformance(profile.id, {
        name: 'heyperform2',
        url: 'asd',
        interval: 4,
        options: {
          ACTIVE: false,
          DELETED: true,
        },
      }),
    ).rejects.toThrowError();
    await expect(
      performUpdate.retrievePerformanceOptions(),
    ).rejects.toThrowError();

    expect(
      await performUpdate.patchPerformanceOptions(profile.id, {
        ACTIVE: false,
        DELETED: true,
      }),
    ).toBeTruthy();

    await expect(
      performUpdate.patchPerformanceOptions(),
    ).rejects.toThrowError();
  });
});
