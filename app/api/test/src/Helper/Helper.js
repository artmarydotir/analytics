class Helper {
  constructor(container) {
    this.container = container;
  }

  async CreateUserHeaderAndToken(username, email, role, options) {
    const user = await this.CreateHelperUser(username, email, role, options);

    const token = await this.container.resolve('JWT').sign(
      {
        uid: user.dataValues.id,
        roles: user.dataValues.role,
      },
      600,
    );
    return {
      user,
      token,
    };
  }

  /**
   *
   * @param {*} username
   * @param {*} email
   * @param {*} role
   * @param {*} options
   * @returns
   */
  async CreateHelperUser(
    username = 'heynewbie',
    email = 'heynewbie@gmail.com',
    role = 'SA',
    options = [1],
  ) {
    const userData = {
      username,
      email,
      password: 'onCHGni7i7EfdF$@',
      role,
      lang: 'fa',
      options,
    };

    const createUser = this.container.resolve('UserCreateRepository');

    return createUser.addUser(userData);
  }

  // create sample domain process
  async CreateDomain() {
    const createProject = this.container.resolve('ProjectCreateRepository');
    const createUser = this.container.resolve('UserCreateRepository');
    const createDomain = this.container.resolve('DomainCreateRepository');

    const user = await createUser.addUser({
      username: 'samplehelper',
      email: 'samplehelper@gmail.com',
      password: 'a1asQsW12!@AS',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744185',
    });

    const project = await createProject.addProject({
      title: 'sample helper',
      publicToken: '1236s57',
      description: 'hey sample helper',
      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['VIEWALL', 'PROJECTADMIN'],
        },
      ],
      primaryOwner: user.id,
    });

    const dom = await createDomain.addDomain({
      domain: 'samplehelper.com',
      wildcardDomain: '',
      description: 'there sample helper',
      options: [1],
      projectId: project.id,
    });

    return {
      user,
      project,
      dom,
    };
  }

  // create sample project
  async CreateProject() {
    const createProject = this.container.resolve('ProjectCreateRepository');
    const createUser = this.container.resolve('UserCreateRepository');
    const user = await createUser.addUser({
      username: 'samplehelper',
      email: 'samplehelper@gmail.com',
      password: 'a1asQsW12!@AS',
      role: 'AD',
      lang: 'fa',
      options: [1],
      country: 'IR',
      mobile: '09017744185',
    });

    const user2 = await createUser.addUser({
      username: 'useraccess',
      email: 'useraccess@gmail.com',
      password: 'a1asQsW12!@AS',
      role: 'AD',
      lang: 'fa',
      options: [1],
    });

    const project = await createProject.addProject({
      title: 'sample helper',
      publicToken: '1236s57',
      description: 'hey sample helper',
      userAndRules: [
        {
          UserId: user.dataValues.id,
          rules: ['VIEWALL', 'PROJECTADMIN'],
        },
        {
          UserId: user2.dataValues.id,
          rules: ['VIEWALL'],
        },
      ],
      options: [1],
      primaryOwner: user.id,
    });

    return {
      project,
    };
  }
}

module.exports = Helper;
