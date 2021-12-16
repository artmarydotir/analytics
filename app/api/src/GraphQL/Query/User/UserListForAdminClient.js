const { ErrorWithProps } = require('mercurius').default;
const checkToken = require('../../../Utils/CheckToken');

const { constants: userRoles } = require('../../../Schema/UserRoles');
const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { projectId, args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { UserListRepository } = container;

  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  let validClient = false;
  if (token.roles === userRoles.CLIENT) {
    validClient = await UserListRepository.isClientWithAdminAccess(
      token.uid,
      projectId,
    );
  }

  if (validClient) {
    return UserListRepository.fetchUserList({
      lastSeen,
      filter,
      limit,
    });
  }

  throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
    statusCode: 403,
  });
};
