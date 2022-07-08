const { ClickHouse } = require('clickhouse');

class ClickH {
  constructor({ Config, ClickRootCa, ClickClientFullChain, ClickClientKey }) {
    this.selected =
      Config.ASM_CLICKHOUSE_SERVERS[
        Math.floor(Math.random() * Config.ASM_CLICKHOUSE_SERVERS.length)
      ];

    /**
     * @type {import('clickhouse').ClickHouse}
     * @private
     */
    this.connection = null;

    this.ClickRootCa = ClickRootCa;
    this.ClickClientFullChain = ClickClientFullChain;
    this.ClickClientKey = ClickClientKey;
  }

  async checkConnection() {
    const result = await Promise.race([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              SUCCESS: 0,
            },
          ]);
        }, 2000);
      }),
      this.connection.query('SELECT 1 AS SUCCESS').toPromise(),
    ]);

    return result[0].SUCCESS === 1;
  }

  async getClient() {
    const uri = new URL(this.selected);

    if (this.connection === null) {
      this.connection = new ClickHouse({
        host: `${uri.protocol}${uri.hostname}`,
        port: uri.port,
        basicAuth: {
          username: uri.username,
          password: uri.password,
        },
        config: {
          session_timeout: 1,
          database: uri.pathname.replace(/\//, ''),
        },
        // add ca certificate files to the connection
        reqParams: {
          agentOptions: {
            key: this.ClickClientKey,
            ca: [this.ClickRootCa],
            cert: this.ClickClientFullChain,
            maxVersion: 'TLSv1.3',
            minVersion: 'TLSv1.2',
          },
        },
        debug: uri.searchParams.has('debug'),
        format: 'json',
        raw: false,
      });
    }
    return this.connection;
  }
}

module.exports = ClickH;
