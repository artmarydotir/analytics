const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { ProjectListRepository } = container;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  return ProjectListRepository.fetchProjectList({
    lastSeen,
    filter,
    limit,
  });
};
