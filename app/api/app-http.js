const init = require('./init');

(async function appHTTP() {
  try {
    const container = await init();

    const Config = container.resolve('Config');

    container.resolve('Logger');

    /** @type {import('./src/Core/Fastify')} */
    const Fastify = container.resolve('Fastify');

    const app = Fastify.getFastify();

    Object.keys(container.registrations).forEach((dep) => {
      if (dep.match(/REST$/)) {
        container.resolve(dep);
      }
    });

    await app.listen(Config.ASM_APP_PORT, '0.0.0.0');
  } catch (e) {
    process.exit(1);
  }
})();

// const { Config: ConfigClass } = require('./src/Config');
// const { initContainer } = require('./src/Container');
// const { ConfigSchema } = require('./src/ConfigSchema');
// const { Logger } = require('./src/Logger');

// (async () => {
//   // create config
//   const ConfigInstance = new ConfigClass(ConfigSchema, process.env);
//   const Config = ConfigInstance.getAll();

//   // list of loggers
//   const Loggers = [];
//   ['FastifyLogger', 'MongooseLogger', 'PostgresLogger'].forEach((name) => {
//     const logger = new Logger(
//       Config.ASM_PUBLIC_APP_NS,
//       name,
//       Config.ASM_LOG_LEVEL,
//       Config.ASM_PUBLIC_APP_TEST,
//     );
//     Loggers.push({
//       name,
//       value: logger,
//     });
//   });

//   const container = await initContainer(ConfigInstance, Loggers);

//   await container.dispose();
// })();
