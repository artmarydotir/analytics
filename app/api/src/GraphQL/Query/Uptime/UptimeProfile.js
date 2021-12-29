const checkToken = require('../../../Utils/CheckToken');

const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { data }, { container, token }) => {
  const { UptimeProfileRepository } = container;
  const { id } = data;

  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  return UptimeProfileRepository.returnUptimeData(id);
};
