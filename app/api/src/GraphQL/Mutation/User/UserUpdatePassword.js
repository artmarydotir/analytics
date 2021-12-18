const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { UserProcessRepository, UserUpdateMemberPasswordRepository } =
    container;
  const { id, currentPassword, newPassword } = data;

  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  if (token.roles === userRoles.SUPERADMIN) {
    return UserProcessRepository.resetUserPassword(id, newPassword);
  }

  return UserUpdateMemberPasswordRepository.setMemberPassword(
    id,
    currentPassword,
    newPassword,
  );
};
