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

    const { User, Project, UserProject, Domain } = seq.models;
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

    await Domain.destroy({
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

  it('domain profile', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
    const profileProject = container.resolve('DomainProfileRepository');
    const createUser = container.resolve('UserCreateRepository');
    const createDomain = container.resolve('DomainCreateRepository');

    const user = await createUser.addUser({
      username: 'sadomains',
      email: 'adosmainss@gmail.com',
      password: 'a1asQsW12!@AS',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744185',
    });

    const project = await createProject.addProject({
      title: 'donyssasfh g',
      publicToken: '1236s57',
      description: 'hey shesllo',
      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['VIEWALL', 'PROJECTADMIN'],
        },
      ],
      primaryOwner: user.id,
    });

    const dom = await createDomain.addDomain({
      domain: 'aa.com',
      wildcardDomain: '',
      description: 'there',
      options: [1],
      projectId: project.id,
    });

    expect(await profileProject.returnDomainData(dom.id)).toBeTruthy();

    await expect(profileProject.returnDomainData()).rejects.toThrowError();
    await expect(profileProject.returnDomainData(126)).rejects.toThrowError();
  });
});
