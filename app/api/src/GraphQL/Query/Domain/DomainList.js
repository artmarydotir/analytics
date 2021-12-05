const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { DomainListRepository } = container;

  const hasAccess = checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
  ]);

  let list = [];

  if (hasAccess) {
    list = await DomainListRepository.fetchDomainList({
      lastSeen,
      filter,
      limit,
    });
  }

  return list;
};
