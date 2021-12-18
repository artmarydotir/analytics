const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { UserUpdateRepository } = container;
  const { id } = data;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  const removingData = {
    ACTIVE: false,
    DELETED: true,
  };

  const result = await UserUpdateRepository.patchUserOptions(id, removingData);
  return result.id;
};
