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

    const { User } = seq.models;
    await User.destroy({
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

  it('fetch user list', async () => {
    const userList = container.resolve('UserListRepository');
    const createUser = container.resolve('UserCreateRepository');

    await createUser.addUser({
      username: 'heytester',
      email: 'heytester@gmail.com',
      password: 'a1WsQW12!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744145',
      additional: {
        gender: 'female',
      },
    });

    await createUser.addUser({
      username: 'heytester2',
      email: 'heyteste2@gmail.com',
      password: 'a1asQW12!@AS*&',
      role: 'VI',
      lang: 'en',
      options: [1, 2],
      additional: {
        gender: 'female',
      },
    });

    await createUser.addUser({
      username: 'maryyq',
      email: 'heyteste3@gmail.com',
      password: 'a1asQW12!@AS*&',
      role: 'SA',
      lang: 'en',
      country: 'IR',
      mobile: '09127052565',
      options: [2],
      additional: {
        gender: 'other',
      },
    });

    //  dts_createdAt: '2021-06-27 12:00:00',
    //  dte_createdAt: '2022-04-27 12:00:00',
    const result1 = await userList.fetchUserList({
      lastSeen: 1,
      limit: 40,
      filter: {
        like_mobile: '912',
        like_email: 'hey',
        eq_role: 'SA',
        arrIn_options: [2],
        dte_createdAt: '2090-04-27 12:00:00',
      },
    });
    console.log('----------------------', result1);
    expect(result1).toBeTruthy();
    expect(result1[0].dataValues.username).toBe('maryyq');
  });
});
