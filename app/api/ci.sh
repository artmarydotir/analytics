#!/bin/sh
set -e

yarn install

./node_modules/.bin/depcheck . --ignores="@types/*,depcheck,typescript,pm2"

npm run lint

npm run test:cover

./test/totalCoverage.js
