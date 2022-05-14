#!/bin/sh
set -e

cd /app/api \
  && ./node_modules/.bin/pm2-runtime pm2.dev.config.js
