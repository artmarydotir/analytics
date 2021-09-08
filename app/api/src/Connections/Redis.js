const IoRedis = require('ioredis');
const mqredis = require('mqemitter-redis');

class Redis {
  constructor({ Config }) {
    /** @private */
    this.uri = Config.ASM_REDIS_URI;

    /** @private */
    this.ns = Config.ASM_PUBLIC_APP_NS;

    /**
     * @type {import('ioredis').Redis}
     * @private
     */
    this.connection = null;

    /** @private */
    this.mQEmitter = null;
  }

  /**
   * @return {Promise<import('ioredis').Redis>}
   */
  async getRedis() {
    if (this.connection === null) {
      const rURI = new URL(this.uri);
      // @ts-ignore
      this.mQEmitter = mqredis({
        port: rURI.port ? rURI.port : 6379,
        host: rURI.host,
        username: rURI.username ? rURI.username : undefined,
        password: rURI.password ? rURI.password : undefined,
        db: 2,
        keyPrefix: `${this.ns}:mqe:`,
      });
      await new Promise((r) => setTimeout(r, 100));
      this.connection = new IoRedis(this.uri, {
        db: 1,
        lazyConnect: true,
        keyPrefix: `${this.ns}:m:`,
      });
      await this.connection.connect();
    }
    return this.connection;
  }

  /**
   * @return {Promise<any>}
   */
  async getMQEmitter() {
    return this.mQEmitter;
  }

  /**
   * @returns {Promise<void>}
   */
  async quit() {
    if (this.connection) {
      await new Promise((resolve) => {
        this.mQEmitter.close(() => {
          setTimeout(resolve, 100);
        });
      });
      await this.connection.quit();
      this.connection = undefined;
    }
  }
}

module.exports = Redis;
