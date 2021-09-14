const { resolve } = require('path');
const { createContainer, asValue, asClass, Lifetime } = require('awilix');

// logger
const { Logger } = require('./Logger');

// graphql
const graphqlTypeDefsLoader = require('./GraphQL/typeDefs');
const graphqlResolvers = require('./GraphQL/resolvers');

// dependencies
const Redis = require('./Connections/Redis');
const Postgres = require('./Connections/Postgres');

/**
 * @param {import('./Config').Config} Config
 * @return {Promise<import('awilix').AwilixContainer>}
 */
const initContainer = async (Config) => {
  const container = createContainer();

  container.register({
    // config
    Config: asValue(Config.getAll()),
    PublicConfig: asValue(Config.getPublic()),

    // logger
    Logger: asValue(new Logger(Config.getAll())),
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
  const redisClient = await container.resolve('Redis').getRedis();
  const mQEmitter = await container.resolve('Redis').getMQEmitter();

  // Postgres
  container.register({
    Postgres: asClass(Postgres, {
      lifetime: Lifetime.SINGLETON,
      async dispose(i) {
        await i.end();
      },
    }),
  });
  const pgClient = await container.resolve('Postgres').getClient();

  const graphqlTypeDefs = await graphqlTypeDefsLoader();

  container.register({
    pgClient: asValue(pgClient),
    redisClient: asValue(redisClient),
    mQEmitter: asValue(mQEmitter),

    graphqlTypeDefs: asValue(graphqlTypeDefs),
    graphqlResolvers: asValue(graphqlResolvers),
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

  // OpenAPI
  container.loadModules([`${resolve(__dirname, 'OpenAPI/**/*REST.js')}`], {
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

  return container;
};

module.exports = { initContainer };
