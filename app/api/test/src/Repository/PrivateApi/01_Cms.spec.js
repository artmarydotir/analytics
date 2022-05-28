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

  it('get all current user in project', async () => {
    const cms = container.resolve('PageViewCountRepository');
    const referer = container.resolve('RefererDataRepository');

    // const r = await cms.getPageViewCount({
    //   publicToken: 'project00001',
    //   privateToken: 'uYI127In0xpBXRYNuslBL8GWsop591ZD',
    //   type: ['Users', 'Sessions', 'PageView'],
    //   startDate: '2022-04-28T12:17:42.008Z',
    //   endDate: null,
    // });
    const r = await referer.getRefererData({
      publicToken: 'project00001',
      refererType: 'SessionReferer',
      refererTypeValue: '0',
      startDate: '2022-04-28T12:17:42.008Z',
      // endDate: null,
    });

    console.log(r);
  });
});
