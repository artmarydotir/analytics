/* eslint-disable sonarjs/no-duplicate-string */
class EventIdentCountREST {
  constructor({ Fastify, IdentCountRepository, ProjectValidityRepository }) {
    /** @type {import('fastify').FastifyInstance} */
    this.fastify = Fastify.getFastify();

    /** @type {import('../../Core/Fastify/GenericResponse').GenericResponse} */
    const e403 = Fastify.getGenericError(403);
    const e404 = Fastify.getGenericError(404);
    const e422 = Fastify.getGenericError(422);

    const apiUrl = this.fastify.openAPIBaseURL('/private/event/ident-count');

    this.fastify.route({
      url: apiUrl,
      method: 'POST',
      schema: {
        description: 'Event Identity count',
        operationId: 'IdentCount',
        tags: ['AnalyticsEvent'],
        body: {
          $ref: 'IdentCount#',
        },
        headers: {
          type: 'object',
          properties: {
            'x-public-token': {
              type: 'string',
              description: 'Project Public Instance ID',
            },
            'x-private-token': {
              type: 'string',
              description: 'Project Private token',
            },
          },
          required: ['x-public-token', 'x-private-token'],
        },
        security: [
          {
            privateToken: [],
          },
        ],
        response: {
          404: e404.getSchema(),
          422: e422.getSchema(),
        },
      },
      preHandler: async (req, reply) => {
        const { headers } = req;
        if (!headers['x-public-token'] || !headers['x-private-token']) {
          return e403.reply(reply);
        }
        const {
          'x-public-token': publicToken,
          'x-private-token': privateToken,
        } = headers;

        if (
          await ProjectValidityRepository.checkPairKey({
            publicToken,
            privateToken,
          })
        ) {
          return undefined;
        }

        return e403.reply(reply);
      },
      handler: async (req, reply) => {
        /** @type {Object} */

        const { body } = req;
        const result = await IdentCountRepository.getEIdentCount({
          ...body,
          publicToken: req.headers['x-public-token'],
        });

        if (!result) {
          return e404.reply(reply);
        }
        return result;
      },
    });
  }
}

module.exports = EventIdentCountREST;
