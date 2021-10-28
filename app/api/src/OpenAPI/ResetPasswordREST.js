class ResetPasswordREST {
  constructor({ UserResetPasswordRepository, Fastify }) {
    /** @type {import('fastify').FastifyInstance} */
    this.fastify = Fastify.getFastify();

    /** @type {import('../Core/Fastify/GenericResponse').GenericResponse} */
    const e404 = Fastify.getGenericError(404);

    this.fastify.route({
      url: this.fastify.openAPIBaseURL('/user/reset-password'),
      method: 'POST',
      config: {
        rateLimit: {
          max: 4,
          timeWindow: '1 minute',
        },
      },
      schema: {
        description: 'send code and reset password',
        body: {
          operationId: 'UserResetPassword',
          $ref: 'UserResetPassword#',
        },
        tags: ['User'],

        response: {
          200: {
            type: 'boolean',
          },
          404: e404.getSchema(),
        },
      },
      handler: async (req, reply) => {
        /** @type {Object} */
        const { body } = req;

        try {
          return await UserResetPasswordRepository.checkTokenAndResetUserPassword(
            body.token,
            body.password,
          );
        } catch (e) {
          const status =
            e.extensions && e.extensions.statusCode
              ? e.extensions.statusCode
              : 500;
          return reply.status(status).send({
            message: e.message,
            status,
          });
        }
      },
    });
  }
}

module.exports = ResetPasswordREST;
