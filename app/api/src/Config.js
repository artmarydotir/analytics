const { envSchema } = require('env-schema');

class Config {
  /**
   * @param {Object} schema
   * @param {Object} envObject
   */
  constructor(schema, envObject) {
    /** @private */
    this.schema = schema;
    /** @private */
    this.config = {};
    /** @private */
    this.public = {};

    this.process(envObject);
  }

  /**
   * @param {Object} envObject
   * @private
   * @return {Config}
   */
  process(envObject) {
    /** @type {any} */
    const ConfigObject = {
      ASM_PM_ID: process.env.pm_id || '0',
    };
    Object.keys(envObject).forEach((name) => {
      if (name.match(/^ASM_/)) {
        ConfigObject[`${name}`] = envObject[`${name}`];
      }
    });

    this.config = envSchema({
      schema: this.schema,
      data: ConfigObject,
    });

    Object.keys(this.config).forEach((name) => {
      if (name.match(/^ASM_PUBLIC_/)) {
        this.public[`${name}`] = this.config[`${name}`];
      }
    });

    return this;
  }

  /**
   * @return {Object}
   */
  getAll() {
    return this.config;
  }

  /**
   * @return {Object}
   */
  getPublic() {
    return this.public;
  }
}

module.exports = { Config };
