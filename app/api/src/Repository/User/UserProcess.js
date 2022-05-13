/* eslint-disable class-methods-use-this */
const argon2 = require('argon2');
const { shuffle, uniq } = require('lodash');
const { authenticator } = require('otplib');
const crypto = require('crypto');
const { to } = require('await-to-js');
const { Op } = require('sequelize');
const { ErrorWithProps } = require('mercurius').default;
const { parsePhoneNumber } = require('libphonenumber-js/max');
const { constants: UserOption } = require('../../Schema/UserOption');
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

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

  /**
   * @param {String} input
   * @param {String} otpSecret
   * @returns {Boolean}
   */
  verifyOtp(input, otpSecret) {
    const isValid = authenticator.check(input, otpSecret);
    return isValid === true;
  }

  /**
   *
   * @param {String} rawPassword
   */
  async setPassword(rawPassword) {
    const [err, data] = await to(argon2.hash(rawPassword));
    if (err) {
      return false;
    }
    return data;
  }

  /**
   * @param {String} hashedPassword
   * @param {String} rawPassword
   * @returns {Promise<Boolean>}
   */
  async verifyPassword(hashedPassword, rawPassword) {
    return new Promise((resolve) => {
      argon2
        .verify(hashedPassword, rawPassword)
        .then((valid) => {
          resolve(valid);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  /**
   *
   * @param {*} number
   * @param {*} code
   * @returns
   */
  setMobile(number, code) {
    const phoneNumber = parsePhoneNumber(number, code);
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
        options: { [Op.contains]: [UserOption.ACTIVE] },
      },
    });
    return !!res;
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
        options: { [Op.contains]: [UserOption.ACTIVE] },
      },
    });

    if (!user) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return user.dataValues.id;
  }

  /**
   *
   * @param {number} userId
   * @returns  {Promise<object>}
   */
  async returnActiveUserDataByID(userId) {
    const { User } = this.sequelize.models;

    const user = await User.findOne({
      where: {
        id: userId,
        options: { [Op.contains]: [UserOption.ACTIVE] },
      },
    });

    if (!user) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return user.dataValues;
  }

  /**
   *
   * @param {Object} param
   * @param {String} param.email
   * @param {String} param.username
   * @returns  {Promise<object>}
   */

  async returnActiveUserData({ email = null, username = null }) {
    const { User } = this.sequelize.models;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
        options: { [Op.contains]: [UserOption.ACTIVE] },
      },
    });

    if (!user) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return user.dataValues;
  }

  /**
   * @param {Number} userId
   * @returns  {Promise<Boolean>}
   */
  async isUserExistByID(userId) {
    const { User } = this.sequelize.models;
    let isExist = false;

    const user = await User.findOne({
      where: {
        id: userId,
        options: { [Op.contains]: [UserOption.ACTIVE] },
      },
    });

    if (!user) {
      isExist = false;
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    } else {
      isExist = true;
    }

    return isExist;
  }

  /**
   * @param {Number} userId
   * @returns  {Promise<Boolean>}
   */
  async userExistNotOptionCheck(userId) {
    const { User } = this.sequelize.models;
    let isExist = false;

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      isExist = false;
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    } else {
      isExist = true;
    }

    return isExist;
  }

  /**
   *
   * @returns  {Promise<string>}
   */
  async generatePassword() {
    const shuffleNoneAlphaList = shuffle('!@#$%^&*_+=-~'.split(''));

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
   * @param {String} param.password
   * @returns  {Promise<{}>}
   */
  async setGeneratedPassword({
    username = null,
    email = null,
    password = null,
  }) {
    let psw;
    if (!password) {
      psw = await this.generatePassword();
    } else {
      psw = password;
    }

    const { User } = this.sequelize.models;
    const user = await User.update(
      {
        password: await this.setPassword(psw),
      },
      {
        where: {
          [Op.or]: [{ email }, { username }],
        },
      },
    );

    return { found: user[0] > 0, psw };
  }

  /**
   *
   * @param {Number} userId
   * @param {String} newPassword
   * @returns {Promise<{}>}
   */
  async resetUserPassword(userId, newPassword) {
    const user = await this.returnActiveUserDataByID(userId);

    if (user) {
      const { User } = this.sequelize.models;
      await User.update(
        {
          password: await this.setPassword(newPassword),
        },
        {
          where: {
            id: userId,
          },
        },
      );
      return { id: userId };
    }

    throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
      statusCode: 404,
    });
  }
}

module.exports = UserProcess;
