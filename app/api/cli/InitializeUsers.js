const chalk = require('chalk');

const { log } = console;

module.exports = {
  name: 'super-admin',
  description: 'Create Super Amin User',
  /**
   * @param {import('awilix').AwilixContainer} container
   * @param {Object} args
   */

  async runAction(container) {
    const userRepository = container.resolve('UserCreateRepository');
    const userProcess = container.resolve('UserProcessRepository');
    const config = container.resolve('Config');
    const userExist = await userProcess.isUserExistAndActive({
      username: config.ASM_DEFAULT_ADMIN_USERNAME,
    });

    if (userExist) {
      const { generatedPassword } = await userProcess.setGeneratedPassword({
        username: config.ASM_DEFAULT_ADMIN_USERNAME,
      });

      log(
        `😇 Username is: ${chalk.white.bgMagenta.bold(
          config.ASM_DEFAULT_ADMIN_USERNAME,
        )}`,
      );
      log(
        `👉 Generated Password is: ${chalk.white.bgBlue.bold(
          generatedPassword,
        )} 👈`,
      );
    } else {
      const newPassword = await userProcess.generatePassword({
        username: config.ASM_DEFAULT_ADMIN_USERNAME,
      });

      const user = await userRepository.addUser({
        username: config.ASM_DEFAULT_ADMIN_USERNAME,
        email: 'adminer@gmail.com',
        password: newPassword,
        role: 'SA',
        lang: 'en',
        options: [1],
      });

      if (user) {
        log(`${chalk.yellow.bold('🔔 New user created: 🔔')}`);
        log(
          `😇 Username is: ${chalk.white.bgRed.bold(
            config.ASM_DEFAULT_ADMIN_USERNAME,
          )}`,
        );
        log(`👉 Password is: ${chalk.white.bgBlue.bold(newPassword)} 👈`);
      }
    }
  },
};
