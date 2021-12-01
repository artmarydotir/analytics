const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { id, data }, { container, token }) => {
  const { DomainUpdateRepository } = container;

  console.log(data, '111', id);
  if (!token && token.roles === userRoles.VIEWER) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  try {
    const domainData = await DomainUpdateRepository.updateDomain(id, data);
    console.log(domainData);
    return domainData.id;
  } catch (e) {
    throw new ErrorWithProps(e.message, {
      statusCode: e.extensions ? e.extensions.statusCode : 500,
      message: e.extensions ? e.extensions.validation : '',
    });
  }
};
