#!/usr/bin/env node
/* eslint-disable node/shebang */

const commander = require('commander');
const chalk = require('chalk');

const cli = require('./cli/index');
const init = require('./init');

(async () => {
  process.env.ASM_LOG_STDOUT_FILTER = '';
  const container = await init();

  const program = new commander.Command();
  program.description(
    chalk`{cyan Command line interface for ${
      container.resolve('Config').ASM_PUBLIC_APP_TITLE
    }}`,
  );

  cli(program, container);
})();
