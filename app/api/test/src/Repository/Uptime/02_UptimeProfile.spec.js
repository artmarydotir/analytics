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

  it('fetch uptime profile', async () => {
    const createUptime = container.resolve('UptimeCreateRepository');
    const upProfile = container.resolve('UptimeProfileRepository');

    const profile = await createUptime.addUptime({
      name: 'heyuptime',
      url: 'https://jacynthe.biz',
      description: 'i can be a description',
      ping: false,
      interval: 6,
      options: [1],
    });

    const b = await upProfile.returnUptimeData(profile.id);
    expect(b).toBeTruthy();

    await expect(upProfile.returnUptimeData()).rejects.toThrowError();
    await expect(upProfile.returnUptimeData(125)).rejects.toThrowError();
  });
});
