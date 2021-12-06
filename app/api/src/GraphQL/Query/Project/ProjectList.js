const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { ProjectListRepository } = container;

  if (!token || token.roles === userRoles.CLIENT) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  let list = [];

  if (token.roles === userRoles.ADMIN || token.roles === userRoles.SUPERADMIN) {
    list = await ProjectListRepository.fetchProjectList({
      lastSeen,
      filter,
      limit,
    });
  }

  if (!list) {
    throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
      statusCode: 404,
    });
  }

  return list;
};
