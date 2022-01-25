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

  it('add domain', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
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

    const projectID = await createProject.addProject({
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

    expect(
      await createDomain.addDomain({
        domain: 'aa.com',
        wildcardDomain: '',
        description: 'there',
        options: [1],
        projectId: projectID.id,
      }),
    ).toBeTruthy();

    expect(
      await createDomain.addDomain({
        domain: '',
        wildcardDomain: '*.google.tld',
        description: 'there you go',
        options: [1],
        projectId: projectID.id,
      }),
    ).toBeTruthy();

    await expect(
      createDomain.addDomain({
        domain: 'asa.com',
        wildcardDomain: '*.asa.com',
        description: 'there',
        options: [1],
        projectId: projectID.id,
      }),
    ).rejects.toThrowError();

    await expect(
      createDomain.addDomain({
        domain: '',
        wildcardDomain: '+',
        description: 'there',
        options: [1],
        projectId: projectID.id,
      }),
    ).rejects.toThrowError();

    await expect(
      createDomain.addDomain({
        domain: '',
        wildcardDomain: '',
        description: 'there',
        options: [1],
        projectId: projectID.id,
      }),
    ).rejects.toThrowError();

    await expect(
      createDomain.addDomain({
        domain: '127.0.0.3',
        wildcardDomain: '',
        description: 'there',
        options: [1],
        projectId: projectID.id,
      }),
    ).rejects.toThrowError();

    await expect(
      createDomain.addDomain({
        domain: 'hey.com',
        wildcardDomain: '',
        description: 'there',
        options: [1],
      }),
    ).rejects.toThrowError();
  });
});
