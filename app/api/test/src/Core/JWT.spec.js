/* eslint-env jest */

const { fastify } = require('fastify');
const { to } = require('await-to-js');

const JWT = require('../../../src/Core/JWT');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('light-my-request').Response} */
  let resp;

  const Config = {
    ASM_AUTH_HMAC_SECRET: '01234567890123456789012345678901',
    ASM_AUTH_HMAC_ALG: 'HS256',
    ASM_AUTH_COOKIE: '__Host-AuthToken',
  };

  it('JWT', async () => {
    const payload = {
      uid: Math.floor(Math.random() * 100) + 1,
    };

    const jwt = new JWT({ Config });

    const validToken = await jwt.sign(payload, 3);
    expect(validToken).toBeTruthy();
    const newVerifiedPayload = await jwt.verify(validToken);
    expect(newVerifiedPayload).toBeTruthy();
    const [e] = await to(jwt.verify(Date.now().toString()));
    expect(e).toBeInstanceOf(Error);

    // test with http application
    const httpApp = fastify();
    httpApp.route({
      url: '/validate',
      method: 'GET',
      handler: async (req, reply) => {
        const [, t] = await to(jwt.verifyFromRequest(req.raw));
        if (t) {
          return reply.status(200).send(t);
        }
        return reply.status(403).send('Forbidden');
      },
    });

    // no header
    resp = await httpApp.inject({
      url: '/validate',
    });
    expect(resp.statusCode).toBe(403);

    // invalid header name
    resp = await httpApp.inject({
      url: '/validate',
      headers: {
        authorization: `Sample ${validToken}`,
      },
    });
    expect(resp.statusCode).toBe(403);

    // invalid header name
    resp = await httpApp.inject({
      url: '/validate',
      headers: {
        cookie: `NotInName=${validToken}`,
      },
    });
    expect(resp.statusCode).toBe(403);

    // invalid cookie name
    resp = await httpApp.inject({
      url: '/validate',
      headers: {
        cookie: `${Config.ASM_AUTH_COOKIE}Addon=${validToken}`,
      },
    });
    expect(resp.statusCode).toBe(403);

    // invalid header value
    resp = await httpApp.inject({
      url: '/validate',
      headers: {
        authorization: `Bearer 1111`,
      },
    });
    expect(resp.statusCode).toBe(403);

    // valid Bearer
    resp = await httpApp.inject({
      url: '/validate',
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    });
    expect(resp.statusCode).toBe(200);

    // valid Cookie
    resp = await httpApp.inject({
      url: '/validate',
      headers: {
        cookie: `${Config.ASM_AUTH_COOKIE}=${validToken}`,
      },
    });
    const backPayload = JSON.parse(resp.body);
    expect(resp.statusCode).toBe(200);
    expect(backPayload.uid).toBe(payload.uid);
  });
  it('JWT User', async () => {
    const jwt = new JWT({ Config });

    /** @type {import('../../../addon').Token} */
    const payload = {
      pubsub: true,
      roles: ['A'],
      uid: Math.random().toString(36).substring(2),
      upload: 1024,
    };

    const validToken = await jwt.signUser(payload, 300);

    expect(validToken).toBeTruthy();

    // test with http application
    const httpApp = fastify();
    httpApp.route({
      url: '/validate',
      method: 'GET',
      handler: async (req, reply) => {
        const [, data] = await to(jwt.verifyUserFromRequest(req.raw));
        if (data) {
          return reply.status(200).send(data);
        }
        return reply.status(403).send('Forbidden');
      },
    });

    resp = await httpApp.inject({
      url: '/validate',
      headers: {
        cookie: `${Config.ASM_AUTH_COOKIE}=${validToken}`,
      },
    });

    const backPayload = JSON.parse(resp.body);
    expect(resp.statusCode).toBe(200);
    expect(backPayload.uid).toBe(payload.uid);

    resp = await httpApp.inject({
      url: '/validate',
      headers: {
        cookie: `${Config.ASM_AUTH_COOKIE}=${validToken}a`,
      },
    });

    expect(resp.statusCode).toBe(403);
  });
});
