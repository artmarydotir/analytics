/* eslint-disable sonarjs/no-identical-functions */
const { waterfall } = require('async');
const chalk = require('chalk');

const { log } = console;
const { list: userRoles } = require('../src/Schema/UserRoles');

module.exports = {
  name: 'fixture',
  description: 'Creating Fixture',
  /**
   * @param {import('awilix').AwilixContainer} container
   * @param {Object} args
   */

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async runAction(container) {
    const config = container.resolve('Config');

    if (config.ASM_PUBLIC_APP_TEST !== true) {
      log(
        `${chalk.yellow.bold(
          '⚠️ fixture is not available on development mood ⚠️',
        )}`,
      );
      return;
    }

    const seq = container.resolve('sequelize');
    const createUser = container.resolve('UserCreateRepository');
    const createProject = container.resolve('ProjectCreateRepository');
    const createDomain = container.resolve('DomainCreateRepository');

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

    const roles = userRoles;
    const lang = ['fa', 'en'];

    // user
    const userCallbacks = [];
    for (let index = 1; index < 121; index += 1) {
      const roleIndex = index % roles.length;

      userCallbacks.push((cb) => {
        createUser
          .addUser({
            username: `user${index}`,
            password: `user${index}PassWord`,
            email: `user${index}@example.tld`,
            role: roles[`${roleIndex}`],
            lang: lang[Math.floor(Math.random() * lang.length)],
            options: [Math.floor(Math.random() * 2) + 1],
          })
          .then(() => cb())
          .catch((e) => cb(e));
      });
    }

    await new Promise((resolve, reject) => {
      waterfall(userCallbacks, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });

    // project
    const projectCallbacks = [];

    for (let index = 1; index < 61; index += 1) {
      projectCallbacks.push((cb) => {
        createProject
          .addProject({
            title: `project${index}`,
            publicToken: `project${index.toString().padStart(5, '0')}`,
            description: 'project dear project',
            options: [Math.floor(Math.random() * 2) + 1],
            userAndRules: [
              {
                UserId: Math.floor(Math.random() * 10) + 1,
                rules: ['ALL', 'VIEW_A'],
              },
              {
                UserId: Math.floor(Math.random() * 50) + 11,
                rules: ['ALL', 'VIEW_C'],
              },
            ],
            additional: {},
          })
          .then(() => cb())
          .catch((e) => cb(e));
      });
    }

    await new Promise((resolve, reject) => {
      waterfall(projectCallbacks, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });

    // domain
    const domainCallbacks = [];

    for (let index = 1; index < 41; index += 1) {
      domainCallbacks.push((cb) => {
        createDomain
          .addDomain({
            domain: `domain${index}.tld`,
            wildcardDomain: '',
            description: `there you go domain number ${index}`,
            options: [Math.floor(Math.random() * 2) + 1],
            projectId: Math.floor(Math.random() * 30) + 1,
            additional: {
              alexaRank: `${index}`,
            },
          })
          .then(() => cb())
          .catch((e) => cb(e));
      });
    }

    await new Promise((resolve, reject) => {
      waterfall(domainCallbacks, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });

    log(`${chalk.green('✔ Truncate data tables')}`);
    log(`${chalk.green('✔ Create 120 Users')}`);
    log(`${chalk.green('✔ Create 60 Projects')}`);
    log(`${chalk.green('✔ Create 40 Domains')}`);
  },
};
