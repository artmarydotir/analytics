const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { ProjectSimpleListRepository } = container;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  return ProjectSimpleListRepository.fetchProjectSimpleList({
    lastSeen,
    filter,
    limit,
  });
};
