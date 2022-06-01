const { ClickHouse } = require('clickhouse');

class ClickH {
  constructor({ Config }) {
    /** @private */
    this.uri = Config.ASM_CLICKHOUSE_URI;

    /** @private */
    this.port = Config.ASM_CLICKHOUSE_PORT;

    /**
     * @type {import('clickhouse').ClickHouse}
     * @private
     */
    this.connection = null;
  }

  async getClient() {
    if (this.connection === null) {
      this.connection = new ClickHouse({
        // host: '10.0.10.189',
        host: '192.168.1.218',
        port: this.port,
        basicAuth: {
          username: 'analytics',
          password: 'password123123',
        },
        config: {
          database: 'analytics',
        },
        debug: true,
        format: 'json',
        raw: false,
      });
    }
    return this.connection;
  }
}

module.exports = ClickH;
