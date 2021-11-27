const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { ProjectSimpleListRepository } = container;

  if (!token || token.roles !== userRoles.SUPERADMIN) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  const list = await ProjectSimpleListRepository.fetchProjectSimpleList({
    lastSeen,
    filter,
    limit,
  });

  if (!list) {
    throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
      statusCode: 404,
    });
  }

  return list;
};
