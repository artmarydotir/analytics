class Sequential {
  constructor({ pgClient }) {
    /**
     * @private
     * @type {import('pg').PoolClient}
     */
    this.pg = pgClient;
  }

  /**
   * @param {Number} model
   * @returns {Promise<Number>}
   */
  async getNextSequentialIdentifier(model) {
    const r = await this.pg.query('SELECT get_next_sequential_identifier($1)', [
      model,
    ]);
    return r.rows[0];
  }
}

module.exports = Sequential;
