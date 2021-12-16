const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { DomainListRepository } = container;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  return DomainListRepository.fetchDomainList({
    lastSeen,
    filter,
    limit,
  });
};
