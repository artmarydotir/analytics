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
    console.log(e);
    process.exit(1);
  }
})();
