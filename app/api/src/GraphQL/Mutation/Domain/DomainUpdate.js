const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { id, data }, { container, token }) => {
  const { DomainUpdateRepository } = container;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  const domainData = await DomainUpdateRepository.updateDomain(id, data);

  return domainData.id;
};
