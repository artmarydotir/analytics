const { readFile } = require('fs').promises;
const { resolve } = require('path');

module.exports = async () =>
  readFile(resolve(__dirname, 'typeDefs.graphql'), {
    encoding: 'utf8',
  });
