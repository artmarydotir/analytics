/* eslint-env jest */

const net = require('net');

// @ts-ignore
require('../../globals');

const { Logger } = require('../../src/Logger');

describe(__filename.replace(__dirname, ''), () => {
  const serverPort = 49150;
  /** @type {import('net').Server} */
  let server;

  let unicodeData = '';
  let dataStream = [];
  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    server = net.createServer((socket) => {
      socket.on('data', (chunk) => {
        dataStream.push(chunk);
      });
      socket.on('end', () => {
        unicodeData = Buffer.concat(dataStream).toString('utf8');
      });
    });
    await new Promise((resolve) => {
      server.listen(serverPort, '127.0.0.1', () => {
        resolve();
      });
    });
  });
  afterAll(async () => {
    server.close(() => {
      unicodeData = '';
      dataStream = [];
    });
  });

  it('Logger trace', async () => {
    const Config = {
      ASM_PUBLIC_APP_NS: 'test',
      ASM_LOG_LEVEL: 1,
      ASM_PUBLIC_APP_TEST: true,
      ASM_LOG_STDOUT_FILTER: ['def', 'http', 'pg'],
    };

    const logger = new Logger(Config);
    expect(logger.abstractLogger()).toBeTruthy();
    expect(logger.processHandler()).toBeTruthy();

    await logger.toNDJSON('/tmp');
    await new Promise((r) => setTimeout(r, 500));

    logger.log({ foo: 'bar' });
    logger.processHandler().uncaughtException(new Error('uncaughtException'));
    logger.processHandler().warning(new Error('uncaughtException'));
    logger
      .processHandler()
      .unhandledRejection(
        new Error('unhandledRejection'),
        new Promise((r) => setTimeout(r, 100)),
      );

    logger
      .processHandler()
      .rejectionHandled(new Promise((r) => setTimeout(r, 100)));

    logger
      .processHandler()
      .multipleResolves(
        'resolve',
        new Promise((r) => setTimeout(r, 100)),
        'value',
      );

    logger.fatal('fatal msg');
    logger.error('error msg');
    logger.warn('warn msg');
    logger.log('log msg');
    logger.info('info msg');
    logger.debug('debug msg');
    logger.trace('trace msg');

    await logger.toNDJSON('/tmp');
  });

  it('Logger fatal', async () => {
    const Config = {
      ASM_PUBLIC_APP_NS: 'test',
      ASM_LOG_LEVEL: 6,
      ASM_PUBLIC_APP_TEST: false,
      ASM_LOG_STDOUT_FILTER: ['def', 'http', 'pg'],
    };

    const logger = new Logger(Config);

    await logger.toTCPServer('127.0.0.1', serverPort);
    expect(unicodeData.length).toBe(0);

    logger.log({
      foo: 'bar',
      bar: {
        baz: new Date(),
      },
    });

    logger.fatal('fatal msg');
    logger.error('error msg');
    logger.warn('warn msg');
    logger.log('log msg');
    logger.info('info msg');
    logger.debug('debug msg');
    logger.trace('trace msg');

    expect(logger.getEntriesLength()).toBeTruthy();

    await logger.toTCPServer('127.0.0.1', serverPort);
    await new Promise((r) => setTimeout(r, 500));
    expect(unicodeData.length > 0).toBe(true);
  });
});
