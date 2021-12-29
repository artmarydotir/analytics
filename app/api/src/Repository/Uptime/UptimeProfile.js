const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class UptimeProfile {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   *
   * @param {Number} id
   * @returns {Promise<object>}
   */

  async returnUptimeData(id) {
    const { Uptime } = this.sequelize.models;

    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const uptime = await Uptime.findOne({
      where: {
        id,
      },
    });

    if (!uptime) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return uptime;
  }
}

module.exports = UptimeProfile;
