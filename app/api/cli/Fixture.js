/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable sonarjs/no-identical-functions */
const { waterfall } = require('async');
const chalk = require('chalk');
const _ = require('lodash');

// eslint-disable-next-line node/no-unpublished-require
const { faker } = require('@faker-js/faker');

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
          '⚠️ fixture is not available on production mood ⚠️',
        )}`,
      );
      return;
    }

    const seq = container.resolve('sequelize');
    const createUser = container.resolve('UserCreateRepository');
    const createProject = container.resolve('ProjectCreateRepository');
    const createDomain = container.resolve('DomainCreateRepository');
    const createUptime = container.resolve('UptimeCreateRepository');
    const createPerformance = container.resolve('PerformanceCreateRepository');

    const { User, Project, UserProject, Domain, Uptime, Performance } =
      seq.models;
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

    await Uptime.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await Performance.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    const lang = ['fa', 'en'];

    // user
    const userCallbacks = [];
    for (let index = 1; index < 121; index += 1) {
      userCallbacks.push((cb) => {
        createUser
          .addUser({
            username: `user${index}`,
            password: `user${index}PassWord`,
            email: `user${index}@example.tld`,
            role: _.sample(userRoles),
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
                rules: ['PROJECTADMIN'],
              },
              {
                UserId: Math.floor(Math.random() * 50) + 11,
                rules: ['PROJECTADMIN', 'VIEWALL'],
              },
            ],
            primaryOwner: Math.floor(Math.random() * 10) + 1,
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

    // uptime
    const numBetween = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const randomBoolean = () => Math.random() < 0.5;
    const uptimeCallbacks = [];

    for (let index = 1; index < 30; index += 1) {
      uptimeCallbacks.push((cb) => {
        createUptime
          .addUptime({
            name: `uptime${index}`,
            url: `${faker.internet.url()}`,
            description: 'uptime dear uptime',
            options: [1],
            interval: Number(numBetween(2, 60)),
            ping: randomBoolean(),
          })
          .then(() => cb())
          .catch((e) => cb(e));
      });
    }

    await new Promise((resolve, reject) => {
      waterfall(uptimeCallbacks, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });

    // Performance
    const performanceCallbacks = [];

    for (let index = 1; index < 30; index += 1) {
      performanceCallbacks.push((cb) => {
        createPerformance
          .addPerformance({
            name: `performance${index}`,
            url: `${faker.internet.url()}`,
            description: 'performance your dear performance',
            options: [1],
            interval: Number(numBetween(2, 60)),
          })
          .then(() => cb())
          .catch((e) => cb(e));
      });
    }

    await new Promise((resolve, reject) => {
      waterfall(performanceCallbacks, (e) => {
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
    log(`${chalk.green('✔ Create 30 Uptimes')}`);
    log(`${chalk.green('✔ Create 30 Performance')}`);
  },
};
