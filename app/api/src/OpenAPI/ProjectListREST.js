class ProjectListREST {
  constructor({ Config, Fastify, ProjectListRepository }) {
    /** @type {import('fastify').FastifyInstance} */
    this.fastify = Fastify.getFastify();

    /** @type {import('../Core/Fastify/GenericResponse').GenericResponse} */
    const e403 = Fastify.getGenericError(403);
    const e404 = Fastify.getGenericError(404);

    const listUrl = this.fastify.openAPIBaseURL('/collector/project-list');
    this.fastify.route({
      url: listUrl,
      method: 'GET',
      schema: {
        description: 'Get all projects domain list',
        operationId: 'ListProject',
        tags: ['Collector'],
        response: {
          200: {
            $ref: 'ProjectDomainList#',
          },
          404: e404.getSchema(),
        },
        security: [
          {
            apiKey: [],
            bearerAuth: [],
            cookieToken: [],
          },
        ],
      },
      preHandler: async (req, reply) => {
        if (
          req.headers['x-collector-api-key'] &&
          req.headers['x-collector-api-key'] === Config.ASM_COLLECTOR_API_KEY
        ) {
          return true;
        }
        return e403.reply(reply);
      },
      handler: async (req, reply) => {
        const result = await ProjectListRepository.getProjectDomainList();
        if (!result) {
          return e404.reply(reply);
        }
        return result;
      },
    });
  }
}

module.exports = ProjectListREST;
