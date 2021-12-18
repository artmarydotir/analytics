const { constants: userRoles } = require('../../../Schema/UserRoles');

const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { DomainCreateRepository } = container;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  const domain = await DomainCreateRepository.addDomain(data);
  return domain.id;
};
