const { STATUS_CODES } = require('http');

class GenericResponse {
  /**
   * @param {Number} statusCode
   * @param {String} message
   */
  constructor(statusCode, message = undefined) {
    this.statusCode = statusCode;
    if (typeof message === 'string') {
      this.message = message;
    } else {
      this.message = STATUS_CODES[statusCode.toString()];
    }
  }

  getSchema() {
    /** @type {import('json-schema').JSONSchema7} */
    return {
      $id: 'GenericResponse',
      title: 'Generic Response',
      description: this.message,
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: this.statusCode,
        },
        message: {
          type: 'string',
          example: this.message,
        },
        validations: {
          type: 'object',
        },
        name: {
          type: 'string',
        },
        stack: {
          type: 'array',
          description: 'During development stage you can see stack trace',
          items: {
            type: 'string',
          },
        },
      },
    };
  }

  /**
   * @param {String} message
   */
  getObject(message = undefined) {
    return {
      statusCode: this.statusCode,
      message: typeof message === 'string' ? message : this.message,
    };
  }

  /**
   * @param {import('fastify').FastifyReply} reply
   * @param {String} message
   */
  reply(reply, message = undefined) {
    reply.status(this.statusCode);
    return reply.send(this.getObject(message));
  }
}

module.exports = {
  GenericResponse,
};
