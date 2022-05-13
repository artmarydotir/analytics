/* eslint-disable sonarjs/no-duplicate-string */
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

    const { User, Project, UserProject } = seq.models;
    await UserProject.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await Project.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

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

  it('add project', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
    const token = container.resolve('ProjectPrivateTokenRepository');
    const createUser = container.resolve('UserCreateRepository');
    const user = await createUser.addUser({
      username: 'generatettok',
      email: 'addproject@gmail.com',
      password: 'a1asQW12!@AS',
      role: 'AD',
      lang: 'fa',
      options: [1],
    });

    const pData = await createProject.addProject({
      title: 'donyaye Eghtesad',
      publicToken: '123654',
      description: 'hey hello',
      primaryOwner: user.id,
      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['VIEWALL', 'PROJECTADMIN'],
        },
      ],
    });

    expect(
      await token.returnProjectPrivateToken(
        pData.id,
        'a1asQW12!@AS',
        user.dataValues.id,
      ),
    ).toBeTruthy();

    await expect(token.returnProjectPrivateToken()).rejects.toThrowError();
    await expect(
      token.returnProjectPrivateToken(pData.id, 'QW12!@AS', user.dataValues.id),
    ).rejects.toThrowError();
    await expect(
      token.returnProjectPrivateToken(
        456888,
        'a1asQW12!@AS',
        user.dataValues.id,
      ),
    ).rejects.toThrowError();
  });
});
