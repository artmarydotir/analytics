const { to } = require('await-to-js');

class AuthREST {
  constructor({
    UserAuthRepository,
    UserProcessRepository,
    JWT,
    Config,
    Fastify,
  }) {
    /** @type {import('fastify').FastifyInstance} */
    this.fastify = Fastify.getFastify();

    const refreshURL = this.fastify.openAPIBaseURL('/user/auth/refresh');

    /** @type {import('../Core/Fastify/GenericResponse').GenericResponse} */
    const e403 = Fastify.getGenericError(403);
    const e404 = Fastify.getGenericError(404);

    this.fastify.route({
      url: refreshURL,
      method: 'GET',
      schema: {
        tags: ['Auth'],
      },
      handler: async (req, reply) => {
        const refreshToken = req.cookies[Config.ASM_AUTH_REFRESH_COOKIE];

        if (!refreshToken) {
          return e403.reply(reply);
        }

        const [err, refreshTokenData] = await to(JWT.verify(refreshToken));
        const { payload } = refreshTokenData;

        if (err || !payload.expire || payload.expire < Date.now()) {
          return e403.reply(reply);
        }

        const user = await UserProcessRepository.returnActiveUserDataByID(
          payload.uid,
        );
        // console.log(refreshTokenData, '----------------');

        // // > token new
        const token = await JWT.sign(
          {
            uid: user.id,
            role: user.role,
          },
          Config.ASM_PUBLIC_AUTH_TOKEN_TTL,
        );

        const tokenTime = new Date();
        tokenTime.setTime(
          tokenTime.getTime() + Config.ASM_PUBLIC_AUTH_TOKEN_TTL * 1000,
        );

        reply.setCookie(Config.ASM_AUTH_COOKIE, token, {
          path: Config.ASM_PUBLIC_BASE_URL,
          sameSite: 'strict',
          httpOnly: true,
          expires: tokenTime,
        });

        let refreshTokenTTL = Config.ASM_PUBLIC_AUTH_REFRESH_TOKEN_TTL;
        if (payload.remember) {
          refreshTokenTTL = Config.ASM_PUBLIC_AUTH_REFRESH_TOKEN_REMEMBER_TTL;
        }

        const lastHour = new Date();
        lastHour.setTime(payload.expire - 3600000);

        if (lastHour < new Date()) {
          const refreshTime = new Date();
          refreshTime.setTime(refreshTime.getTime() + refreshTokenTTL * 1000);

          const newRefreshToken = await JWT.sign(
            {
              uid: user.id,
              expire: refreshTime.getTime().toString(),
              remember: payload.remember,
            },
            refreshTokenTTL,
          );

          reply.setCookie(Config.ASM_AUTH_REFRESH_COOKIE, newRefreshToken, {
            path: refreshURL,
            sameSite: 'strict',
            httpOnly: true,
            expires: refreshTime,
          });
        }

        return {
          id: user.id,
          role: user.role,
          expire: tokenTime,
        };
      },
    });

    this.fastify.route({
      url: this.fastify.openAPIBaseURL('/user/auth/login'),
      method: 'POST',
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '1 minute',
        },
      },
      schema: {
        body: {
          operationId: 'UserSignIn',
          $ref: 'UserSignIn#',
        },
        tags: ['Auth'],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              expires: { type: 'string' },
              role: { type: 'string' },
            },
          },
          403: e403.getSchema(),
        },
      },
      handler: async (req, reply) => {
        /** @type {Object} */
        const { body } = req;

        try {
          const user = await UserAuthRepository.signIn(body.type, body.data);

          const tokenTime = new Date();
          tokenTime.setTime(
            tokenTime.getTime() + Config.ASM_PUBLIC_AUTH_TOKEN_TTL * 1000,
          );

          let refreshTokenTTL = Config.ASM_PUBLIC_AUTH_REFRESH_TOKEN_TTL;
          if (body.remember) {
            refreshTokenTTL = Config.ASM_PUBLIC_AUTH_REFRESH_TOKEN_REMEMBER_TTL;
          }

          const refreshTime = new Date();
          refreshTime.setTime(refreshTime.getTime() + refreshTokenTTL * 1000);

          const token = await JWT.sign(
            {
              uid: user.id,
              role: user.role,
            },
            Config.ASM_PUBLIC_AUTH_TOKEN_TTL,
          );

          reply.setCookie(Config.ASM_AUTH_COOKIE, token, {
            path: Config.ASM_PUBLIC_BASE_URL,
            sameSite: 'strict',
            httpOnly: true,
            expires: tokenTime,
          });

          const refreshToken = await JWT.sign(
            {
              uid: user.id,
              expire: refreshTime.getTime().toString(),
              remember: body.remember,
            },
            refreshTokenTTL,
          );

          reply.setCookie(Config.ASM_AUTH_REFRESH_COOKIE, refreshToken, {
            path: refreshURL,
            sameSite: 'strict',
            httpOnly: true,
            expires: refreshTime,
          });

          return {
            id: user.id,
            expire: tokenTime,
            role: user.role,
          };
        } catch (e) {
          return reply
            .status(
              e.extensions && e.extensions.statusCode
                ? e.extensions.statusCode
                : 500,
            )
            .send(e.message);
        }
      },
    });
  }
}

module.exports = AuthREST;
