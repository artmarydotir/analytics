// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  // eslint-disable-next-line class-methods-use-this
  sort(tests) {
    const copyTests = Array.from(tests);
    return copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
  }
}

module.exports = CustomSequencer;
