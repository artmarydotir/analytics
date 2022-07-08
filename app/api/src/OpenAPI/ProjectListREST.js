class ProjectListREST {
  constructor({ Config, Fastify, ProjectDomainListRepository }) {
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
        querystring: {
          type: 'object',
          properties: {
            t: {
              type: 'string',
            },
          },
          required: ['t'],
        },
        response: {
          404: e404.getSchema(),
        },
      },

      preHandler: async (req, reply) => {
        // @ts-ignore
        if (req.query.t !== Config.ASM_COLLECTOR_API_KEY) {
          return e403.reply(reply);
        }

        return true;
      },
      handler: async (req, reply) => {
        const result = await ProjectDomainListRepository.getProjectDomainList();
        if (!result) {
          return e404.reply(reply);
        }
        return result;
      },
    });
  }
}

module.exports = ProjectListREST;
