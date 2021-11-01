class Helper {
  constructor(container) {
    this.container = container;
  }

  async CreateUserHeaderAndToken(username, email, role, options) {
    const user = await this.CreateHelperUser(username, email, role, options);
    console.log(user.dataValues, '00998877');
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
}

module.exports = Helper;
