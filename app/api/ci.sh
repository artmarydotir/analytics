#!/bin/bash
set -e

npm install

./node_modules/.bin/depcheck . --ignores="@types/*,depcheck,typescript"

npm run lint

npm run test:cover

./test/totalCoverage.js
