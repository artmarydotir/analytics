const fs = require('fs');

const commander = require('commander');

const { log } = console;

// eslint-disable-next-line security/detect-non-literal-fs-filename
const jsFiles = fs.readdirSync(__dirname);

const commands = [];

jsFiles.forEach((file) => {
  if (file !== 'index.js' && file.match(/.js$/)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require, security/detect-non-literal-require
    const cmd = require(`./${file}`);
    commands.push(cmd);
  }
});

/**
 * @param {import('commander').Command} program
 * @param {import('awilix').AwilixContainer} container
 */
module.exports = async (program, container) => {
  commands.forEach(({ name, description, options, runAction }) => {
    const cmd = new commander.Command(name);
    cmd.description(description);
    if (options) {
      options.forEach((opt) => {
        const optO = new commander.Option(opt.flags, opt.description);
        if (opt.default) {
          optO.default(opt.default);
        }
        if (opt.required) {
          cmd.requiredOption(opt.flags, opt.description, opt.default);
        } else {
          cmd.addOption(optO);
        }
      });
    }
    cmd.action(async (...args) => {
      try {
        await runAction(container, ...args);
      } catch (e) {
        log(e);
      }
      await container.dispose();
    });
    program.addCommand(cmd);
  });

  program.parse(process.argv);
};
