const checkToken = require('../../../Utils/CheckToken');

const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { data }, { container, token }) => {
  const { PerformanceProfileRepository } = container;
  const { id } = data;

  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  return PerformanceProfileRepository.returnPerformanceData(id);
};
