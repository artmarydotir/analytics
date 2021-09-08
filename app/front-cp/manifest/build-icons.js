#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.resolve(`${__dirname}/..`);

const config = JSON.parse(
  fs.readFileSync(`${__dirname}/config.json`, { encoding: 'utf8' }),
);

const commands = [
  `rm -rf ${projectDir}/static/_icons`,
  `mkdir ${projectDir}/static/_icons`,
  `cp -rf ${projectDir}/manifest/logo.svg ${projectDir}/static/_icons/logo.svg`,
  `convert ${projectDir}/manifest/logo.png -define icon:auto-resize=64,48,32,24,16 ${projectDir}/static/favicon.ico`,
];

Object.keys(config.icons).forEach((name) => {
  const size = config.icons[name];
  commands.push(
    `convert ${projectDir}/manifest/logo.png -resize ${size}x${size} ${projectDir}/static/_icons/${name}.png`,
  );
  commands.push(
    `pngquant --quality 0-1 --force --speed 1 ${projectDir}/static/_icons/${name}.png --output ${projectDir}/static/_icons/${name}.png`,
  );
});

execSync(commands.join(' && '));
