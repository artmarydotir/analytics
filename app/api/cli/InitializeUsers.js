const chalk = require('chalk');

const { log } = console;

module.exports = {
  name: 'super-admin',
  description: 'Create Super Amin User',
  /**
   * @param {import('awilix').AwilixContainer} container
   */

  async runAction(container) {
    const userRepository = container.resolve('UserCreateRepository');
    const userProcess = container.resolve('UserProcessRepository');
    const config = container.resolve('Config');
    const userExist = await userProcess.isUserExistAndActive({
      email: config.ASM_DEFAULT_ADMIN_EMAIL,
    });

    if (userExist) {
      let passWord;
      const { generatedPassword } = await userProcess.setGeneratedPassword({
        email: config.ASM_DEFAULT_ADMIN_EMAIL,
      });

      passWord = generatedPassword;
      if (config.ASM_PUBLIC_APP_TEST) {
        passWord = 'testPassworda1s2d3';
        await userProcess.setGeneratedPassword({
          email: config.ASM_DEFAULT_ADMIN_EMAIL,
          password: 'testPassworda1s2d3',
        });
      }

      log(
        `😇 email is: ${chalk.white.bgRed.bold(
          config.ASM_DEFAULT_ADMIN_EMAIL,
        )}`,
      );
      log(`👉 Generated Password is: ${chalk.white.bgBlue.bold(passWord)} 👈`);
    } else {
      let newPassword;

      if (config.ASM_PUBLIC_APP_TEST) {
        newPassword = 'testPassworda1s2d3';
      } else {
        newPassword = await userProcess.generatePassword();
      }

      const user = await userRepository.addUser({
        username: config.ASM_DEFAULT_ADMIN_USERNAME,
        email: config.ASM_DEFAULT_ADMIN_EMAIL,
        password: newPassword,
        role: 'SA',
        lang: 'en',
        options: [1],
      });

      if (user) {
        log(`${chalk.yellow.bold('🔔 New user created: 🔔')}`);
        log(
          `😇 email is: ${chalk.white.bgRed.bold(
            config.ASM_DEFAULT_ADMIN_EMAIL,
          )}`,
        );
        log(`👉 Password is: ${chalk.white.bgBlue.bold(newPassword)} 👈`);
      }
    }
  },
};
