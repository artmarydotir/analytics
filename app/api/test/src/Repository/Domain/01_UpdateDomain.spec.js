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

  it('update domain', async () => {
    const createProject = container.resolve('ProjectCreateRepository');
    const createUser = container.resolve('UserCreateRepository');
    const createDomain = container.resolve('DomainCreateRepository');
    const updateDomain = container.resolve('DomainUpdateRepository');

    const user = await createUser.addUser({
      username: 'sadomains',
      email: 'adosmainss@gmail.com',
      password: 'a1asQsW12!@AS',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744185',
      additional: {
        gender: 'female',
      },
    });

    const projectID = await createProject.addProject({
      title: 'donyssasfh g',
      publicToken: '1236s57',
      description: 'hey shesllo',
      userAndCategory: [
        {
          UserId: user.dataValues.id,
          category: ['ALL', 'VIEW_A'],
        },
      ],
      additional: {},
    });

    const d1 = await createDomain.addDomain({
      domain: 'aka.com',
      wildcardDomain: '',
      description: 'there',
      options: [1],
      projectId: projectID.id,
      additional: {
        alexaRank: '21',
      },
    });

    await expect(updateDomain.updateDomain(null, {})).rejects.toThrowError();

    await expect(updateDomain.updateDomain(d1.id, {})).rejects.toThrowError();

    await expect(
      updateDomain.updateDomain(d1.id, {
        domain: 'aka.com',
        wildcardDomain: '*.aka.com',
        options: [1],
        projectId: projectID.id,
      }),
    ).rejects.toThrowError();

    await expect(
      updateDomain.updateDomain(d1.id, {
        domain: null,
        wildcardDomain: 'a',
        options: [1],
        projectId: projectID.id,
      }),
    ).rejects.toThrowError();

    await expect(
      updateDomain.updateDomain(d1.id, {
        domain: '',
        wildcardDomain: '',
        options: {
          ACTIVE: true,
          DELETED: false,
        },
        projectId: projectID.id,
      }),
    ).rejects.toThrowError();

    await expect(
      updateDomain.updateDomain(d1.id, {
        domain: '127.0.0.3',
        wildcardDomain: '',
        options: {
          ACTIVE: true,
        },
        projectId: projectID.id,
      }),
    ).rejects.toThrowError();

    expect(
      await updateDomain.updateDomain(d1.id, {
        domain: '',
        wildcardDomain: '*.aka.com',
        options: {
          ACTIVE: false,
          DELETED: true,
        },
        description: 'update domain',
        projectId: projectID.id,
        additional: {
          alexaRank: '8',
        },
      }),
    ).toBeTruthy();

    await expect(
      updateDomain.retrieveDomainOptions(null, {}),
    ).rejects.toThrowError();

    await expect(
      updateDomain.patchDomainOptions(null, {}),
    ).rejects.toThrowError();

    expect(
      await updateDomain.patchDomainOptions(d1.id, {
        ACTIVE: false,
        DELETED: true,
      }),
    ).toBeTruthy();
  });
});
