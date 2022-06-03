const { resolve } = require('path');
const { createContainer, asValue, asClass, Lifetime } = require('awilix');

// logger
const { Logger } = require('./Logger');

// graphql
const graphqlTypeDefsLoader = require('./GraphQL/typeDefs');
const graphqlResolvers = require('./GraphQL/resolvers');

// dependencies
const Redis = require('./Connections/Redis');
const ClickHouse = require('./Connections/ClickHouse');
const EntityManager = require('./Connections/EntityManager');

/**
 * @param {import('./Config').Config} Config
 * @return {Promise<import('awilix').AwilixContainer>}
 */
const initContainer = async (Config) => {
  const container = createContainer();

  const LoggerInstance = new Logger(Config.getAll());

  container.register({
    // config
    Config: asValue(Config.getAll()),
    PublicConfig: asValue(Config.getPublic()),

    // logger
    Logger: asValue(LoggerInstance),
  });

  // Redis
  container.register({
    Redis: asClass(Redis, {
      lifetime: Lifetime.SINGLETON,
      async dispose(i) {
        await i.quit();
      },
    }),
  });

  // ClickHouse
  container.register({
    ClickHouse: asClass(ClickHouse, {
      lifetime: Lifetime.SINGLETON,
      // async dispose(i) {
      //   await i.interval();
      // },
    }),
  });

  container.register({
    EntityManager: asClass(EntityManager, {
      lifetime: Lifetime.SINGLETON,
      async dispose(i) {
        await i.quit();
      },
    }),
  });

  const redisClient = await container.resolve('Redis').getRedis();
  const mQEmitter = await container.resolve('Redis').getMQEmitter();

  const sequelize = await container.resolve('EntityManager').getSequelize();
  const ClickHouseInstance = container.resolve('ClickHouse');
  const clickHouseClient = await ClickHouseInstance.getClient();

  await ClickHouseInstance.checkConnection();
  // if (!clickHouseConnectionSuccess) {
  //   console.log({
  //     s: 'failed',
  //     clickHouseConnectionSuccess,
  //     pid: process.env.pm_id,
  //   });

  //   process.exit(1);
  // } else {
  //   console.log({
  //     s: 'OK',
  //     clickHouseConnectionSuccess,
  //     pid: process.env.pm_id,
  //   });
  // }

  const graphqlTypeDefs = await graphqlTypeDefsLoader();

  container.register({
    sequelize: asValue(sequelize),
    redisClient: asValue(redisClient),
    mQEmitter: asValue(mQEmitter),

    graphqlTypeDefs: asValue(graphqlTypeDefs),
    graphqlResolvers: asValue(graphqlResolvers),
    clickHouseClient: asValue(clickHouseClient),
  });

  // Repository
  container.loadModules([`${resolve(__dirname, 'Repository/**/*.js')}`], {
    formatName(name) {
      return `${name}Repository`;
    },
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  });

  // Core
  container.loadModules([`${resolve(__dirname, 'Core/*.js')}`], {
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  });

  // OpenAPI
  container.loadModules([`${resolve(__dirname, 'OpenAPI/**/*REST.js')}`], {
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
    },
  });

  return container;
};

module.exports = { initContainer };
