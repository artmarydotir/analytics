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
    const top = container.resolve('TopUrlsRepository');

    // const r = await cms.getPageViewCount({
    //   publicToken: 'project00001',
    //   types: ['Users', 'Sessions', 'PageView'],
    //   startDate: '2022-05-28T12:17:42.008Z',
    // });
    // const a = new Date();
    // a.setDate(a.getDate() - 28);

    // const r = await referer.getRefererData({
    //   publicToken: 'project00001',
    //   // refererType: 'SessionReferer',
    //   startDate: '2022-01-28T12:17:42.008Z',
    //   limit: 30,
    //   // endDate: null,
    // });

    const r = await top.getTopUrls({
      publicToken: 'project00001',
      type: 'URL',
      startDate: '2022-01-28T12:17:42.008Z',
      limit: 30,
      // endDate: null,
    });

    console.log(r);
  });
});
