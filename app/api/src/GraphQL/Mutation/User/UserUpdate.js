const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { id, data }, { container, token }) => {
  const { UserUpdateRepository } = container;

  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  if (token.roles === userRoles.SUPERADMIN || token.roles === userRoles.ADMIN) {
    return UserUpdateRepository.updateUserBySuperAdmin(id, data);
  }
  return UserUpdateRepository.updateUserByMembers(id, data);
};
