class LogOutREST {
  constructor({ Config, Fastify }) {
    /** @type {import('fastify').FastifyInstance} */
    this.fastify = Fastify.getFastify();

    const logoutURL = this.fastify.openAPIBaseURL('/user/logout');

    this.fastify.route({
      url: logoutURL,
      method: 'GET',
      schema: {
        description: 'Clear cookie data and logout',
        operationId: 'LogoutUser',
        tags: ['User'],
        response: {
          204: {
            type: 'string',
            description: 'Successfully logout',
            nullable: true,
          },
        },
      },
      handler: async (req, reply) => {
        reply.setCookie(Config.ASM_AUTH_REFRESH_COOKIE, '0', {
          path: Config.ASM_PUBLIC_BASE_URL,
          httpOnly: true,
          expires: new Date(0),
        });
        reply.setCookie(Config.ASM_AUTH_COOKIE, '0', {
          path: Config.ASM_PUBLIC_BASE_URL,
          httpOnly: true,
          expires: new Date(0),
        });
        reply.header('Clear-Site-Data', '"*"');

        return reply.status(204).send();
      },
    });
  }
}

module.exports = LogOutREST;
