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

  it('Get referer data', async () => {
    const cursorEntity = container.resolve('CursorEntityPageViewRepository');

    const r = await cursorEntity.getCursorEntityPv({
      publicToken: 'project00001',
      // cursorID: '20220528075837655',
    });

    console.log(r);
  });
});
