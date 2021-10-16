const cookie = require('cookie');
const { to } = require('await-to-js');

const { SignJWT } = require('jose');
const { jwtVerify } = require('jose');

class JWT {
  constructor({ Config }) {
    /** @private */
    this.cookieName = Config.ASM_AUTH_COOKIE;

    /** @private */
    this.secret = new TextEncoder().encode(Config.ASM_AUTH_HMAC_SECRET);

    /** @private */
    this.alg = Config.ASM_AUTH_HMAC_ALG;
  }

  /**
   * @param {Object} payload
   * @param {Number} ttl
   * @return {Promise<String>}
   */
  async sign(payload, ttl) {
    const nowUnix = Math.floor(Date.now() / 1000) - 1;
    return new SignJWT(payload)
      .setNotBefore(nowUnix)
      .setExpirationTime(nowUnix + ttl + 1)
      .setProtectedHeader({ alg: this.alg })
      .sign(this.secret);
  }

  /**
   * @param {import('../../addon').Token} token
   * @param {Number} ttl
   * @return {Promise<String>}
   */
  async signUser(token, ttl) {
    return this.sign(
      {
        uid: token.uid,
        pubsub: token.pubsub,
        roles: token.roles,
        upload: token.upload,
      },
      ttl,
    );
  }

  /**
   * @param {String} token
   * @return {Promise<import('jose/types').JWTVerifyResult>}
   */
  async verify(token) {
    return jwtVerify(token, this.secret);
  }

  /**
   * @param {import('http').IncomingMessage} req
   * @returns {Promise<Object>}
   */
  async verifyFromRequest(req) {
    let match = '';
    if (req.headers.cookie && req.headers.cookie.includes(this.cookieName)) {
      const parsedCookies = cookie.parse(req.headers.cookie);
      if (parsedCookies[this.cookieName]) {
        match = parsedCookies[this.cookieName];
      }
    } else if (req.headers.authorization) {
      const m = req.headers.authorization.match(/^Bearer (.*)$/);
      if (m && m[1]) {
        [, match] = m;
      }
    }

    if (match !== '') {
      const [, token] = await to(this.verify(match));
      if (token) {
        return token.payload;
      }
    }

    return false;
  }

  /**
   * @param {import('http').IncomingMessage} req
   * @return {Promise<import('../../addon').Token|boolean>}
   */
  async verifyUserFromRequest(req) {
    const payload = await this.verifyFromRequest(req);
    if (payload) {
      return {
        uid: payload.uid,
        pubsub: payload.pubsub,
        roles: payload.roles,
        upload: payload.upload,
      };
    }
    return false;
  }
}

module.exports = JWT;
