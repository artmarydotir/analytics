const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { DomainProfileRepository } = container;
  const { id } = data;

  if (!token) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  if (!token.roles || token.roles === userRoles.VIEWER) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  const domain = DomainProfileRepository.returnDomainData(id);

  if (!domain) {
    throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
      statusCode: 404,
    });
  }

  return domain;
};
