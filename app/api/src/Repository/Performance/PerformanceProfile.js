const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class PerformanceProfile {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   *
   * @param {Number} id
   * @returns {Promise<object>}
   */

  async returnPerformanceData(id) {
    const { Performance } = this.sequelize.models;

    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const performance = await Performance.findOne({
      where: {
        id,
      },
    });

    if (!performance) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return performance;
  }
}

module.exports = PerformanceProfile;
