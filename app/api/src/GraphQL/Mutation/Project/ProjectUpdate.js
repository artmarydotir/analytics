const checkToken = require('../../../Utils/CheckToken');
const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { id, data }, { container, token }) => {
  const { ProjectUpdateRepository } = container;

  checkToken(token, _, [userRoles.SUPERADMIN, userRoles.ADMIN]);

  const projectData = await ProjectUpdateRepository.updateProject(id, data);
  return projectData.projectId;
};
