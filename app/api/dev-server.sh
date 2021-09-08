#!/bin/bash
set -e

cd /app/api \
  && pm2-runtime pm2.dev.config.js
