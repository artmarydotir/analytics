class FileProgress {
  constructor({ Redis }) {
    /** @type {import('../Connections/Redis')} */
    this.Redis = Redis;
  }

  /**
   * @param {String} id
   * @returns {Promise<void>}
   */
  async initState(id) {
    await (
      await this.Redis.getRedis()
    ).set(
      `file-progress:${id}:`,
      JSON.stringify({
        state: 'init',
      }),
      'EX',
      3600,
    );
  }

  /**
   * @param {String} id
   * @param {Object} state
   * @param {Number} ttl
   * @returns {Promise<void>}
   */
  async setState(id, state, ttl) {
    await (
      await this.Redis.getRedis()
    ).set(`file-progress:${id}:`, value, 'EX', 3600);
  }

  /**
   * @param {String} key
   * @return {Promise<Object>}
   */
  async getState(key) {
    return (await this.Redis.getRedis()).get(`file-progress:${key}:`);
  }
}

module.exports = FileProgress;
