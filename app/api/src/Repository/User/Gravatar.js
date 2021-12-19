/* eslint-disable class-methods-use-this */
const crypto = require('crypto');
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class Gravatar {
  /**
   * @param {String} email
   * @returns {Promise<String>}
   */
  async createEmailHash(email) {
    if (!email) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_EMAIL, {
        statusCode: 400,
      });
    }

    return crypto.createHash('md5').update(`${email}`).digest('hex');
  }
}

module.exports = Gravatar;
