const { fastify } = require('fastify');

const { Decorate } = require('./Fastify/Decorate.js');
const { ErrorHandler } = require('./Fastify/ErrorHandler.js');
const { GraphQL } = require('./Fastify/GraphQL.js');
const { OpenAPI } = require('./Fastify/OpenAPI.js');
const { RateLimit } = require('./Fastify/RateLimit.js');

const schemaList = require('../Schema');

class Fastify {
  constructor(container) {
    this.Config = container.Config;
    this.PublicConfig = container.PublicConfig;
    this.redisClient = container.redisClient;

    /**
     * @private
     */
    this.fastify = fastify({
      trustProxy: true,
      requestIdHeader: 'x-request-id',
      requestIdLogLabel: 'rid',
      disableRequestLogging: false,
      logger: false,
      maxParamLength: 256,
    });

    Decorate.setup(this.fastify, container);
    ErrorHandler.setup(this.fastify, container);

    schemaList.forEach((schema) => {
      this.fastify.addSchema(schema);
    });

    RateLimit.setup(this.fastify, container);
    OpenAPI.setup(this.fastify, container);
    GraphQL.setup(this.fastify, container);
  }

  /**
   * @returns {import('fastify').FastifyInstance}
   */
  getFastify() {
    return this.fastify;
  }
}

module.exports = Fastify;
