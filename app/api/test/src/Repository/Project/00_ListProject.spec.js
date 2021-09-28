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

    // const { User, Project, UserProject } = seq.models;
    // await UserProject.destroy({
    //   where: {},
    //   truncate: true,
    //   cascade: true,
    //   restartIdentity: true,
    // });

    // await Project.destroy({
    //   where: {},
    //   truncate: true,
    //   cascade: true,
    //   restartIdentity: true,
    // });

    // await User.destroy({
    //   where: {},
    //   truncate: true,
    //   cascade: true,
    //   restartIdentity: true,
    // });
  });

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('add project', async () => {
    const project = container.resolve('ProjectListRepository');

    const b = await project.getProjectDomainList();
    console.log(b);
  });
});
