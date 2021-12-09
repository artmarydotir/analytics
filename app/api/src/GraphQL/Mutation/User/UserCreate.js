const { constants: userRoles } = require('../../../Schema/UserRoles');

const checkToken = require('../../../Utils/CheckToken');
const checkUserAddPermissions = require('../../../Utils/CheckUserAddPermissions');

module.exports = async (_, { data }, { container, token }) => {
  const { UserCreateRepository } = container;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);
  if (token.roles === userRoles.ADMIN) {
    checkUserAddPermissions(data.role);
  }
  const user = await UserCreateRepository.addUser(data);
  return user.dataValues;
};
