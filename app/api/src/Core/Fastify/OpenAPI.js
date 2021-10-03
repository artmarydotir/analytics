const { Organization } = require('@aasaam/information');

const fastifySwagger = require('fastify-swagger').default;

const { GenericResponse } = require('./GenericResponse');

const description = `
### Disclaimer

By using this [API](https://en.wikipedia.org/wiki/API), assume you know what is doing.

#### Support

Ask the for help from **${Organization.en.description}** support center.

* ${Organization.en.telephone.join(', ')}
* ${Organization.en.address.addressLocality}, ${
  Organization.en.address.addressRegion
}, ${Organization.en.address.addressCountry}
`;

class OpenAPI {
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static setup(fastify, container) {
    OpenAPI.swaggerUI(fastify, container);
    OpenAPI.publicConfig(fastify, container);
    OpenAPI.health(fastify, container);
  }

  /**
   * @private
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static health(fastify, container) {
    fastify.route({
      method: 'GET',
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '1 minute',
        },
      },
      url: fastify.openAPIBaseURL('/health'),
      schema: {
        description: 'Public health',
        tags: ['health'],
      },
      handler: async () => {
        /** @type {import('ioredis').Redis} */
        const redis = container.redisClient;

        await redis.info('stats');
      },
    });
  }

  /**
   * @private
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static publicConfig(fastify, container) {
    fastify.route({
      method: 'GET',
      url: fastify.openAPIBaseURL('/config'),
      schema: {
        description: 'Public configuration of application',
        tags: ['config'],
      },
      handler: async (req, reply) => {
        reply.setResponseCacheTTL(120);
        const result = {};
        Object.keys(container.PublicConfig).forEach((name) => {
          result[`${name.replace(/^ASM_PUBLIC_/g, '')}`] =
            container.PublicConfig[`${name}`];
        });
        return result;
      },
    });
  }

  /**
   * @private
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static swaggerUI(fastify, container) {
    const defaultSchemaError = new GenericResponse(500);
    fastify.addSchema(defaultSchemaError.getSchema());

    /** @type {import('fastify-swagger').SwaggerOptions} */
    const openApiConfig = {
      routePrefix: fastify.openAPIBaseURL('/docs'),
      mode: 'dynamic',
      exposeRoute: true,
      openapi: {
        info: {
          title: container.Config.ASM_PUBLIC_APP_TITLE,
          version: '1.0.0',
          description,
          contact: {
            name: Organization.en.name,
            url: Organization.en.url,
            email: Organization.en.email,
          },
          license: {
            name: 'CC-BY-3.0',
            url: 'https://creativecommons.org/licenses/by/3.0/',
          },
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              description:
                'Access for none browser client like mobile applications',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
            cookieToken: {
              description: 'Default access for web application',
              type: 'apiKey',
              in: 'cookie',
              name: container.Config.ASM_AUTH_COOKIE,
            },
            userApiKey: {
              description: 'User access via API Key',
              type: 'apiKey',
              in: 'header',
              name: container.Config.ASM_AUTH_USER_API_KEY,
            },
          },
        },
      },
    };

    fastify.register(fastifySwagger, openApiConfig);
  }
}

module.exports = { OpenAPI };
