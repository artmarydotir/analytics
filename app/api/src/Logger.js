const net = require('net');
const { inspect } = require('util');
const { appendFile } = require('fs');
const { resolve } = require('path');

const chalk = require('chalk');

const { log } = console;

const emojis = {
  fatal: '📛',
  error: '🛑',
  warn: '🟠',
  log: '🔷',
  info: '🔷',
  debug: '🐞',
  trace: '🔎',
};

class Logger {
  constructor(Config) {
    this.app = Config.ASM_PUBLIC_APP_NS;
    this.ns = 'def';
    this.level = Config.ASM_LOG_LEVEL;
    this.toStdOut = Config.ASM_PUBLIC_APP_TEST;

    /**
     * @private
     * @type {String[]}
     */
    this.stdOutFilter = Config.ASM_LOG_STDOUT_FILTER;
    this.entries = [];
  }

  /**
   * @private
   */
  getEntries() {
    const items = this.entries;
    this.entries = [];
    return items;
  }

  /**
   * @returns {Number}
   */
  getEntriesLength() {
    return this.entries.length;
  }

  /**
   * @param {String} host
   * @param {Number} port
   * @returns {Promise<void>}
   */
  async toTCPServer(host, port) {
    const items = this.getEntries();
    return new Promise((resolvePromise) => {
      if (items.length === 0) {
        resolvePromise();
      } else {
        const client = new net.Socket();
        client.connect(port, host, () => {
          const data = Buffer.from(
            items.map((i) => JSON.stringify(i)).join('\n'),
          );
          client.end(data, () => {
            resolvePromise();
          });
        });
      }
    });
  }

  /**
   * @param {String} directory
   * @returns {Promise<void>}
   */
  async toNDJSON(directory) {
    const items = this.getEntries();
    return new Promise((resolvePromise) => {
      if (items.length === 0) {
        resolvePromise();
      } else {
        const time = new Date()
          .toISOString()
          .substr(0, 13)
          .replace(/[^0-9]+/g, '-');
        const name = [this.app, time].join('_');
        const path = resolve(directory, `${name}.ndjson`);
        let lines = items.map((i) => JSON.stringify(i)).join('\n');
        lines += '\n';
        appendFile(path, lines, () => {
          resolvePromise();
        });
      }
    });
  }

  /**
   * @private
   * @param {String} ns
   * @param {('fatal'|'error'|'warn'|'log'|'info'|'debug'|'trace')} level
   * @param {Object|String} data
   */
  push(ns, level, data) {
    if (this.toStdOut && this.stdOutFilter.includes(ns)) {
      const head = [
        emojis[`${level}`],
        new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Tehran' }),
        '',
      ].join(' ');
      const out = inspect(data, {
        colors: true,
        compact: true,
        showHidden: true,
      });
      log(chalk`{bgGray.black ${head}} {bgBlack.bold ${ns}} ${out}`);
    }

    let entry = {
      time: Date.now() / 1000,
      app: this.app,
      ns,
      level,
    };

    if (typeof data === 'string') {
      entry.msg = data;
    } else {
      entry = { ...entry, ...data };
    }
    this.entries.push(entry);
  }

  /**
   * @return {{fatal: Function, error: Function, warn: Function, log: Function, info: Function, debug: Function, trace: Function}}
   */
  abstractLogger() {
    return {
      fatal: this.fatal,
      error: this.error,
      warn: this.warn,
      log: this.log,
      info: this.info,
      debug: this.debug,
      trace: this.trace,
    };
  }

  /**
   * @returns {{uncaughtException: Function, warning: Function, unhandledRejection: Function, rejectionHandled: Function, multipleResolves: Function}}
   */
  processHandler() {
    return {
      uncaughtException: (e) => {
        this.error({
          process: 'uncaughtException',
          code: e.code,
          name: e.name,
          message: e.message,
          stack: e.stack,
          inspect: inspect(e),
          // @ts-ignore
          debugPoint: __debugPoint,
        });
      },
      warning: (e) => {
        this.warn({
          process: 'warning',
          code: e.code,
          name: e.name,
          message: e.message,
          stack: e.stack,
          inspect: inspect(e),
          // @ts-ignore
          debugPoint: __debugPoint,
        });
      },
      unhandledRejection: (reason, promise) => {
        this.error({
          process: 'unhandledRejection',
          reason: inspect(reason),
          promise: inspect(promise),
          // @ts-ignore
          debugPoint: __debugPoint,
        });
      },
      rejectionHandled: (promise) => {
        this.error({
          process: 'rejectionHandled',
          promise: inspect(promise),
          // @ts-ignore
          debugPoint: __debugPoint,
        });
      },
      multipleResolves: (type, promise, reason) => {
        this.error({
          process: 'multipleResolves',
          type: inspect(type),
          promise: inspect(promise),
          reason: inspect(reason),
          // @ts-ignore
          debugPoint: __debugPoint,
        });
      },
    };
  }

  /**
   * @param {Object|String} data
   * @param {String} ns
   * @returns {Logger}
   */
  fatal(data, ns = this.ns) {
    this.push(ns, 'fatal', data);
    return this;
  }

  /**
   * @param {Object|String} data
   * @param {String} ns
   * @returns {Logger}
   */
  error(data, ns = this.ns) {
    if (this.level <= 5) {
      this.push(ns, 'error', data);
    }
    return this;
  }

  /**
   * @param {Object|String} data
   * @param {String} ns
   * @returns {Logger}
   */
  warn(data, ns = this.ns) {
    if (this.level <= 4) {
      this.push(ns, 'warn', data);
    }
    return this;
  }

  /**
   * @param {Object|String} data
   * @param {String} ns
   * @returns {Logger}
   */
  log(data, ns = this.ns) {
    return this.info(ns, data);
  }

  /**
   * @param {Object|String} data
   * @param {String} ns
   * @returns {Logger}
   */
  info(data, ns = this.ns) {
    if (this.level <= 3) {
      this.push(ns, 'info', data);
    }
    return this;
  }

  /**
   * @param {Object|String} data
   * @param {String} ns
   * @returns {Logger}
   */
  debug(data, ns = this.ns) {
    if (this.level <= 2) {
      this.push(ns, 'debug', data);
    }
    return this;
  }

  /**
   * @param {Object|String} data
   * @param {String} ns
   * @returns {Logger}
   */
  trace(data, ns = this.ns) {
    if (this.level <= 1) {
      this.push(ns, 'trace', data);
    }
    return this;
  }
}

module.exports = { Logger };
