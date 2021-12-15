const checkToken = require('../../../Utils/CheckToken');

const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { projectId, args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { UserListRepository } = container;

  console.log({ projectId, args });
  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  if (token.roles === userRoles.CLIENT) {
    const validClient = await UserListRepository.isClientWithAdminAccess(
      token.uid,
      projectId,
    );

    console.log(validClient, '***');
  }
  return UserListRepository.fetchUserList({
    lastSeen,
    filter,
    limit,
  });
};
