class RedisCache {
  constructor({ Redis }) {
    /** @type {import('../Connections/Redis')} */
    this.Redis = Redis;
  }

  /**
   * @param {String} key
   * @param {Object} value
   * @param {Number} ttl
   * @returns {Promise<void>}
   */
  async setRedisCache(key, value, ttl) {
    await (await this.Redis.getRedis()).set(`cache:${key}:`, value, 'EX', ttl);
  }

  /**
   * @param {String} key
   * @return {Promise<Object>}
   */
  async getRedisCache(key) {
    return (await this.Redis.getRedis()).get(`cache:${key}:`);
  }
}

module.exports = RedisCache;
