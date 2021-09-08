#!/usr/bin/env node
/* eslint-disable node/shebang */

const fs = require('fs');

const { log } = console;

const average = (arr) => {
  const s = arr.reduce((p, c) => p + c, 0);
  return s / arr.length;
};

// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readFile(
  `${__dirname}/../coverage/coverage-summary.json`,
  {
    encoding: 'utf8',
  },
  (e, json) => {
    if (e) {
      log('TOTAL_COVERAGE_FOR_CI_F: 0.0');
      log('TOTAL_COVERAGE_FOR_CI_I: 0');
    } else {
      const percentages = [];
      const data = JSON.parse(json);
      Object.keys(data.total).forEach((type) => {
        const { pct } = data.total[`${type}`];
        percentages.push(pct);
      });
      const avg = average(percentages);
      log(`TOTAL_COVERAGE_FOR_CI_F: ${avg.toFixed(2)}`);
      log(`TOTAL_COVERAGE_FOR_CI_I: ${Math.round(avg)}`);
    }
  },
);
