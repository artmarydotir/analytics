const checkToken = require('../../../Utils/CheckToken');
const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { id, data }, { container, token }) => {
  const { PerformanceUpdateRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const performanceData = await PerformanceUpdateRepository.updatePerformance(
    id,
    data,
  );
  return performanceData.performanceId;
};
