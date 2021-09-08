// @ts-ignore
require('./globals');

const { Config: ConfigClass } = require('./src/Config');
const { initContainer } = require('./src/Container');
const { ConfigSchema } = require('./src/ConfigSchema');

/**
 * @returns {Promise<import('awilix').AwilixContainer>}
 */
module.exports = async () => {
  // create config
  const ConfigInstance = new ConfigClass(ConfigSchema, process.env);

  const container = await initContainer(ConfigInstance);

  /** @type {import('./src/Logger').Logger} */
  const logger = container.resolve('Logger');

  process.on('uncaughtException', async (e) => {
    logger.processHandler().uncaughtException(e);
    await logger.toNDJSON('/logs');
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason, promise) => {
    logger.processHandler().unhandledRejection(reason, promise);
    await logger.toNDJSON('/logs');
    await container.dispose();
    process.exit(1);
  });

  process.on('warning', async (e) => {
    logger.processHandler().warning(e);
    await logger.toNDJSON('/logs');
  });

  return container;
};
