const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { ProjectCreateRepository } = container;

  const { id } = data;
  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  const project = await ProjectCreateRepository.regeneratePrivateToken(id);

  return project.privateToken;
};
