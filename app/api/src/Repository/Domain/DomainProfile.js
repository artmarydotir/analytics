const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class DomainProfile {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  /**
   *
   * @param {Number} domainId
   * @returns {Promise<object>}
   */

  async returnDomainData(domainId) {
    const { Domain } = this.sequelize.models;

    if (!domainId) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const domain = await Domain.findOne({
      attributes: [
        'id',
        'domain',
        'wildcardDomain',
        'description',
        'options',
        'ProjectId',
      ],
      where: {
        id: domainId,
      },
    });

    if (!domain) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }

    return domain;
  }
}

module.exports = DomainProfile;
