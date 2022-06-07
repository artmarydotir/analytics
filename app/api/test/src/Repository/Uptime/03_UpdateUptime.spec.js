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
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    await container.dispose();
  });

  it('update uptime', async () => {
    const createUptime = container.resolve('UptimeCreateRepository');
    const upUpdate = container.resolve('UptimeUpdateRepository');

    const profile = await createUptime.addUptime({
      name: 'heyuptime',
      url: 'https://jacynthe.biz',
      description: 'i can be a description',
      ping: false,
      interval: 6,
      options: [1],
    });

    const b = await upUpdate.updateUptime(profile.id, {
      name: 'heyuptime2',
      url: 'https://jac.biz',
      ping: true,
      interval: 4,
      options: {
        ACTIVE: false,
        DELETED: true,
      },
    });
    expect(b).toBeTruthy();

    await expect(upUpdate.updateUptime(null, {})).rejects.toThrowError();
    await expect(
      upUpdate.updateUptime(profile.id, {
        name: 'heyuptime2',
        url: 'asd',
        ping: true,
        interval: 4,
        options: {
          ACTIVE: false,
          DELETED: true,
        },
      }),
    ).rejects.toThrowError();
    await expect(upUpdate.retrieveUptimeOptions()).rejects.toThrowError();

    expect(
      await upUpdate.patchUptimeOptions(profile.id, {
        ACTIVE: false,
        DELETED: true,
      }),
    ).toBeTruthy();

    await expect(upUpdate.patchUptimeOptions()).rejects.toThrowError();
  });
});
