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

    const { Uptime } = seq.models;
    await Uptime.destroy({
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

  it('add Uptime', async () => {
    const createUptime = container.resolve('UptimeCreateRepository');

    expect(
      await createUptime.addUptime({
        name: 'heyuptime',
        url: 'https://jacynthe.biz',
        description: 'i can be a description',
        ping: false,
        interval: 6,
        options: [1],
      }),
    ).toBeTruthy();

    await expect(
      createUptime.addUptime({
        name: 'heyuptimes',
        options: [1],
        ping: true,
      }),
    ).rejects.toThrowError();

    await expect(
      createUptime.addUptime({
        name: 'heyuptime',
        url: 'https://jacynsthe.bi',
        ping: true,
        interval: 8,
        options: [1],
      }),
    ).rejects.toThrowError();
  });
});
