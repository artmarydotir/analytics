/* eslint-disable class-methods-use-this */
const argon2 = require('argon2');
const { shuffle, uniq } = require('lodash');
const { authenticator } = require('otplib');
const crypto = require('crypto');
const { to } = require('await-to-js');
const { Op } = require('sequelize');
const { parsePhoneNumber } = require('libphonenumber-js/max');
const { constants: userStatus } = require('../../Schema/UserStatus');

class UserProcess {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
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
  async isUserExistAndActive({ email = null, username = null }) {
    const { User } = this.sequelize.models;

    const res = await User.findOne({
      attributes: ['id'],
      where: {
        [Op.or]: [{ email }, { username }],
        options: { [Op.contains]: [userStatus.ACTIVE] },
      },
    });
    if (res) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param {Object} param
   * @param {String} param.email
   * @param {String} param.username
   * @returns  {Promise<String>}
   */

  async returnActiveUserID({ email = null, username = null }) {
    const { User } = this.sequelize.models;

    const user = await User.findOne({
      attributes: ['id'],
      where: {
        [Op.or]: [{ email }, { username }],
        options: { [Op.contains]: [userStatus.ACTIVE] },
      },
    });

    if (!user) {
      throw new Error('User Not Exist.');
    }

    return user.dataValues.id;
  }

  /**
   *
   * @returns  {Promise<string>}
   */
  async generatePassword() {
    const shuffleNoneAlphaList = shuffle('!@#$%^&*(*)_+=-~'.split(''));

    const shuffleAlphaList = shuffle(
      crypto
        .createHash('sha256')
        .update(`${Date.now()}:${Math.random()}`)
        .digest('base64')
        .replace(/[^a-z0-9]/gi, '')
        .split(''),
    );

    return shuffle(uniq(`${shuffleAlphaList}${shuffleNoneAlphaList}`.split('')))
      .join('')
      .substr(0, 16);
  }

  /**
   *
   * @param {Object} param
   * @param {String} param.username
   * @param {String} param.email
   * @returns  {Promise<{}>}
   */
  async setGeneratedPassword({ username = null, email = null }) {
    const generatedPassword = await this.generatePassword();

    const { User } = this.sequelize.models;
    const user = await User.update(
      {
        password: await this.generatePassword(),
      },
      {
        where: {
          [Op.or]: [{ email }, { username }],
        },
      },
    );

    return { found: user[0] > 0, generatedPassword };
  }
}

module.exports = UserProcess;
