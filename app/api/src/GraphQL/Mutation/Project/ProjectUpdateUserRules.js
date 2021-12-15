const checkToken = require('../../../Utils/CheckToken');
const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { data }, { container, token }) => {
  const { ProjectUpdateRepository, UserListRepository } = container;

  const { projectId, userAndRules } = data;
  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  if (token.roles === userRoles.CLIENT) {
    await UserListRepository.isClientWithAdminAccess(token.uid, projectId);
  }

  return ProjectUpdateRepository.updateRulesByClient(projectId, userAndRules);
};
