const checkToken = require('../../../Utils/CheckToken');

const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { data }, { container, token }) => {
  const { ProjectProfileRepository } = container;
  const { id } = data;

  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  // bug detected
  if (token.roles === userRoles.CLIENT) {
    return ProjectProfileRepository.returnProjectData(id, true);
  }
  return ProjectProfileRepository.returnProjectData(id);
};
