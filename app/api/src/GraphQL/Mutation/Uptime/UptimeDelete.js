const checkToken = require('../../../Utils/CheckToken');
const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { data }, { container, token }) => {
  const { id } = data;
  const { UptimeUpdateRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const removingData = {
    ACTIVE: false,
    DELETED: true,
  };

  const result = await UptimeUpdateRepository.patchUptimeOptions(
    id,
    removingData,
  );
  return result.uptimeId;
};
