const { GenericResponse } = require('./GenericResponse');

class ErrorHandler {
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static setup(fastify, container) {
    const { ASM_PUBLIC_APP_TEST } = container.Config;

    fastify.setErrorHandler((e, req, reply) => {
      let schemaError = new GenericResponse(e.statusCode ? e.statusCode : 500);

      let error = schemaError.getObject();
      if ('validation' in e) {
        schemaError = new GenericResponse(422);
        error = schemaError.getObject();
        error.message = e.message;
        error.validations = e.validation;
      }

      if (ASM_PUBLIC_APP_TEST) {
        error.name = e.name;
        error.stack = e.stack.split('\n').map((l) => l.trim());
      }

      container.Logger.error(
        {
          id: req.id,
          pid: container.Config.ASM_PM_ID,
          ip: req.raw.getClientIP(),
          uri: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
          msg: error,
        },
        'http',
      );

      return reply.code(error.statusCode).send(error);
    });

    fastify.setNotFoundHandler((req, reply) => {
      const e = new GenericResponse(404);
      e.reply(reply);

      container.Logger.warn(
        {
          id: req.id,
          pid: container.Config.ASM_PM_ID,
          ip: req.raw.getClientIP(),
          uri: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
          msg: 'NotFound',
        },
        'http',
      );
    });
  }
}

module.exports = {
  ErrorHandler,
};
