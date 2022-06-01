const ipaddr = require('ipaddr.js');
const intersection = require('lodash/intersection');

class Decorate {
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static setup(fastify, container) {
    Decorate.baseURL(fastify, container);
    Decorate.onRequest(fastify, container);
    Decorate.decorateReply(fastify);
    Decorate.timingHooks(fastify, container);
    Decorate.onSend(fastify, container);
  }

  /**
   * @private
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static onRequest(fastify, container) {
    // http no cache by default
    fastify.addHook('onRequest', async (req, reply) => {
      // if (req.url.includes('/private-api/')) {
      //   // later
      //   console.log(container);
      // }
      reply.header('Expires', new Date(0).toUTCString());
      reply.header('Pragma', 'no-cache');
      reply.header(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, max-age=0',
      );
    });

    // getFirstHeader
    fastify.addHook('onRequest', async (req) => {
      req.raw.getFirstHeader = function getFirstHeader(name) {
        let head = this.headers[`${name}`];
        if (head) {
          if (Array.isArray(head)) {
            [head] = head;
          }
          return head;
        }
        return '';
      };
    });

    // serverTimings
    fastify.addHook('onRequest', async (req) => {
      req.raw.serverTimings = [];

      req.raw.addTiming = function addTiming(step, time = new Date()) {
        if (container.Config.ASM_PUBLIC_APP_TEST) {
          this.serverTimings.push({
            t: time,
            s: step,
          });
        }
      };
    });

    fastify.addHook('onRequest', async (req) => {
      const payload = await container.JWT.verifyUserFromRequest(req.raw);
      if (payload) {
        req.raw.token = payload;
      }

      req.raw.requireUserRole = (roles) =>
        !!(
          req.raw.token && intersection(req.raw.token.roles, roles).length >= 1
        );

      // get client ip
      req.raw.getClientIP = function getClientIP() {
        return this.getFirstHeader('x-real-ip') || req.ip;
      };

      // get is from private network request
      req.raw.isFromPrivateNetwork = function isFromPrivateNetwork() {
        return ipaddr.IPv4.parse(this.getClientIP()).range() === 'private';
      };

      const webServerTime = req.raw.getFirstHeader('x-app-client-start-timing');
      if (webServerTime && webServerTime.match(/^[0-9.]{10,15}/)) {
        const wsTime = new Date();
        wsTime.setTime(parseFloat(webServerTime) * 1000);
        req.raw.addTiming('web-server', wsTime);
      }

      req.raw.log = function log(msg, level = 'debug') {
        const entry = {
          id: req.id,
          pid: container.Config.ASM_PM_ID,
          ip: req.raw.getClientIP(),
          uri: req.url,
          method: req.method,
          body: req.body,
          query: req.query,
          msg,
        };
        switch (level) {
          case 'warn':
            container.Logger.warn(entry, 'http');
            break;
          case 'error':
            container.Logger.error(entry, 'http');
            break;
          case 'debug':
            container.Logger.debug(entry, 'http');
            break;
          default:
            container.Logger.log(entry, 'http');
        }
      };

      req.raw.addTiming('on-request');
    });
  }

  // /**
  //  * @private
  //  * @param {import('fastify').FastifyInstance} fastify
  //  * @param {Object} container
  //  */
  // static collector(fastify, container) {
  //   const { Config } = container;
  //   fastify.decorate('collectorApiKeyCheck', async (req, reply) => {
  //     if (
  //       req.headers['x-collector-api-key'] &&
  //       req.headers['x-collector-api-key'] === Config.ASM_COLLECTOR_API_KEY
  //     ) {
  //       return true;
  //     }
  //     reply.send(403);
  //   });
  // }

  /**
   * @private
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static baseURL(fastify, container) {
    fastify.decorate(
      'baseURL',
      /**
       * @param {String} path
       */
      (path) =>
        `${container.Config.ASM_PUBLIC_BASE_URL.replace(
          /\/+$/g,
          '',
        )}/api${path}`,
    );

    fastify.decorate(
      'openAPIBaseURL',
      /**
       * @param {String} path
       */
      (path) =>
        `${container.Config.ASM_PUBLIC_BASE_URL.replace(
          /\/+$/g,
          '',
        )}/api/open-api${path}`,
    );
  }

  /**
   * @private
   * @param {import('fastify').FastifyInstance} fastify
   */
  static decorateReply(fastify) {
    fastify.decorateReply(
      'setResponseCacheTTL',
      /**
       * @param {Number} ttl
       * @param {Number} staleAddon
       */
      function setResponseCacheTTL(ttl, staleAddon = 5) {
        const date = new Date();
        const expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + ttl);
        this.header(
          'Cache-Control',
          `max-age=${ttl}, stale-while-revalidate=${
            ttl + staleAddon
          }, stale-if-error=${
            ttl + staleAddon
          }, public, post-check=0, pre-check=0`,
        );
        this.header('Pragma', 'public');
        this.header('Last-Modified', date.toUTCString());
        this.header('Expires', expireDate.toUTCString());
        this.header('X-Accel-Expires', expireDate.toUTCString());
      },
    );
  }

  /**
   * @private
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static timingHooks(fastify, container) {
    fastify.addHook('preHandler', async (req) => {
      if (container.Config.ASM_PUBLIC_APP_TEST) {
        req.raw.addTiming('pre-handler');
      }
    });

    fastify.addHook('preParsing', async (req) => {
      if (container.Config.ASM_PUBLIC_APP_TEST) {
        req.raw.addTiming('pre-parsing');
      }
    });

    fastify.addHook('preSerialization', async (req) => {
      if (container.Config.ASM_PUBLIC_APP_TEST) {
        req.raw.addTiming('pre-serialization');
      }
    });

    fastify.addHook('preValidation', async (req) => {
      if (container.Config.ASM_PUBLIC_APP_TEST) {
        req.raw.addTiming('pre-validation');
      }
    });
  }

  /**
   * @private
   * @param {import('fastify').FastifyInstance} fastify
   * @param {Object} container
   */
  static onSend(fastify, container) {
    fastify.addHook('onSend', async (req, reply) => {
      if (container.Config.ASM_PUBLIC_APP_TEST) {
        req.raw.addTiming('on-send');
        let first = 0;
        let last = 0;
        const times = [];
        const { serverTimings } = req.raw;
        serverTimings.forEach(({ t, s }, i) => {
          if (first === 0) {
            first = t.getTime();
          }
          last = t.getTime();
          let dur = 0;
          const previews = serverTimings[i - 1];
          if (previews) {
            dur = t.getTime() - previews.t.getTime();
          }
          times.push(`${i}_${s};dur=${dur}`);
        });
        times.push(`total;dur=${last - first}`);
        reply.header('X-App-Pid', container.Config.ASM_PM_ID);
        reply.header('Server-Timing', times.join(','));
      }
      reply.header('X-App-Ns', container.Config.ASM_PUBLIC_APP_NS);
    });
  }
}

module.exports = {
  Decorate,
};
