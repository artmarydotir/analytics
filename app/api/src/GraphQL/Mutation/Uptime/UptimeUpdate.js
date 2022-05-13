const checkToken = require('../../../Utils/CheckToken');
const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { id, data }, { container, token }) => {
  const { UptimeUpdateRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const uptimeData = await UptimeUpdateRepository.updateUptime(id, data);
  return uptimeData.uptimeId;
};
