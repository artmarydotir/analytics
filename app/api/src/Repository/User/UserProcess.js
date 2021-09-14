/* eslint-disable class-methods-use-this */
const argon2 = require('argon2');
const { shuffle, uniq } = require('lodash');
const { authenticator } = require('otplib');
const { parsePhoneNumber } = require('libphonenumber-js/max');
const crypto = require('crypto');
const { to } = require('await-to-js');

class UserProcess {
  constructor({ pgClient }) {
    /**
     * @private
     * @type {import('pg').PoolClient}
     */

    this.pg = pgClient;
  }

  /**
   *
   * @returns {String}
   */
  generateNewOtpSecret() {
    return authenticator.generateSecret(12);
  }

  async setPassword(rawPassword) {
    const [err, data] = await to(argon2.hash(rawPassword));
    if (err) {
      return false;
    }
    return data;
  }

  setMobile(no, code) {
    const phoneNumber = parsePhoneNumber(no, code);
    if (phoneNumber.isValid() && phoneNumber.getType() === 'MOBILE') {
      return phoneNumber.number;
    }
    return false;
  }

  /**
   *
   * @param {Object} param
   * @param {String} param.email
   * @param {String} param.username
   * @returns  {Promise<Boolean>}
   */
  async isUserExistAndActive({ email, username }) {
    const query = {
      name: 'fetch-user',
      text: 'SELECT id FROM users WHERE email = $1 or username = $2',
      values: [email, username],
    };
    const res = await this.pg.query(query);
    if (res.rows.length === 1) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param {*} username
   * @returns {Promise<string>}
   */
  async generatePassword(username) {
    const shuffleNoneAlphaList = shuffle('!@#$%^&*(*)_+=-~'.split(''));

    const shuffleAlphaList = shuffle(
      crypto
        .createHash('sha256')
        .update(`${Date.now()}:${Math.random()}`)
        .digest('base64')
        .replace(/[^a-z0-9]/gi, '')
        .split(''),
    );

    const generatedPassword = shuffle(
      uniq(`${shuffleAlphaList}${shuffleNoneAlphaList}`.split('')),
    )
      .join('')
      .substr(0, 16);

    const exist = await this.isUserExistAndActive(username);
    if (exist) {
      const newPassword = await this.setPassword(generatedPassword);
      const query = {
        name: 'update-user',
        text: 'UPDATE users SET password = $1 where username = $2',
        values: [newPassword, username],
      };

      await this.pg.query(query);
    }
    return generatedPassword;
  }
}

module.exports = UserProcess;
