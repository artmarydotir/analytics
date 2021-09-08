#!/bin/bash
set -e

npm install --force \
  && npm run lint \
  && npm run type-check \
  && npm run test:cover \
  && ./test/totalCoverage.js
