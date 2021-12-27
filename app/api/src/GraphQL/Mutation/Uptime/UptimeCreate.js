const { constants: userRoles } = require('../../../Schema/UserRoles');

const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { UptimeCreateRepository } = container;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  const uptime = await UptimeCreateRepository.addUptime(data);

  return uptime.id;
};
