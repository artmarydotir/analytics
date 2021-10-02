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

  it('add user', async () => {
    const createUser = container.resolve('UserCreateRepository');
    // const ooo = container.resolve('UserProcessRepository');

    // const b = await ooo.isUserExistAndActive({
    //   email: 'heymary@gmail.com',
    // });

    expect(
      await createUser.addUser({
        username: 'heymary',
        email: 'heymary@gmail.com',
        password: 'a1asQW12!@AS*&',
        role: 'AD',
        lang: 'fa',
        options: [1],
        country: 'IR',
        mobile: '09017744145',
        additional: {
          gender: 'female',
        },
      }),
    ).toBeTruthy();

    expect(
      await createUser.addUser({
        username: 'heymary2',
        email: 'heymary1@gmail.com',
        password: 'a1asQW12!@A',
        role: 'SA',
        lang: 'en',
        options: [2],
      }),
    ).toBeTruthy();

    await expect(
      createUser.addUser({
        username: '1',
        email: 'heymary2@gmail.com',
        password: 'a1asQW12!@AS',
        role: 'VI',
        lang: 'en',
        options: [1],
      }),
    ).rejects.toThrowError();

    await expect(
      createUser.addUser({
        username: 'heymary3',
        email: 'heymary3@gmail.com',
        password: 'a1asQW12!@AS',
        role: 'VI',
        lang: 'en',
        country: 'AF',
        mobile: '09017744145',
        options: [1],
      }),
    ).rejects.toThrowError();
  });
});
