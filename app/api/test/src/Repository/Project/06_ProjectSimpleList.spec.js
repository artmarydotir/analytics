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
    await User.destroy({
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
    await UserProject.destroy({
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

  it('fetch user list', async () => {
    const projectList = container.resolve('ProjectSimpleListRepository');
    const createUser = container.resolve('UserCreateRepository');
    const createProject = container.resolve('ProjectCreateRepository');

    const user = await createUser.addUser({
      username: 'imatestuser',
      email: 'imatestuser@gmail.com',
      password: 'a1WsQW12!@AS*&',
      role: 'AD',
      lang: 'fa',
      options: [1],
    });

    await createProject.addProject({
      title: 'donyaye egh',
      description: 'hey hello',
      primaryOwner: user.id,
      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['VIEWALL', 'PROJECTADMIN'],
        },
      ],
    });

    const result1 = await projectList.fetchProjectSimpleList({
      limit: 40,
      filter: {
        like_title: 'don',
      },
    });

    expect(result1).toBeTruthy();
  });
});
