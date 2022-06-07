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
    await new Promise((r) => {
      setTimeout(r, 1000);
    });
    await container.dispose();
  });

  it('Get max cursor Id', async () => {
    const cursorEntity = container.resolve('CursorEntityPageViewRepository');

    const r = await cursorEntity.getCursorEntityPv({
      publicToken: 'project00001',
      entityModule: 'post',
    });

    expect(r.query.cursorID).toBe(undefined);
  });

  it('Get page view with cursor', async () => {
    const cursorEntity = container.resolve('CursorEntityPageViewRepository');

    const possiblePast = new Date(new Date().getTime() - 604800000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');
    const possiblePastInt = parseInt(possiblePast, 10);

    const r2 = await cursorEntity.getCursorEntityPv({
      publicToken: 'project00001',
      cursorID: `${possiblePastInt}000000000`,
      entityModule: 'news',
    });

    expect(r2.result.items).toBeInstanceOf(Array);
  });
});
