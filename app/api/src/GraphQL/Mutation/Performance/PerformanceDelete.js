const checkToken = require('../../../Utils/CheckToken');
const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { data }, { container, token }) => {
  const { id } = data;
  const { PerformanceUpdateRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const removingData = {
    ACTIVE: false,
    DELETED: true,
  };

  const result = await PerformanceUpdateRepository.patchPerformanceOptions(
    id,
    removingData,
  );
  return result.performanceId;
};
