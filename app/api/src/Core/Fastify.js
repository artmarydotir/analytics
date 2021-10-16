const { fastify } = require('fastify');
const { fastifyCookie } = require('fastify-cookie');

const { Decorate } = require('./Fastify/Decorate');
const { ErrorHandler } = require('./Fastify/ErrorHandler');
const { GraphQL } = require('./Fastify/GraphQL');
const { OpenAPI } = require('./Fastify/OpenAPI');
const { RateLimit } = require('./Fastify/RateLimit');
const { GenericResponse } = require('./Fastify/GenericResponse');

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

    this.fastify.register(fastifyCookie);

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

  /**
   * @param {Number} statusCode
   * @param {String} message
   * @returns {GenericResponse}
   */
  // eslint-disable-next-line class-methods-use-this
  getGenericError(statusCode, message = undefined) {
    return new GenericResponse(statusCode, message);
  }
}

module.exports = Fastify;
