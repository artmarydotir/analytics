const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { ProjectPrivateTokenRepository } = container;

  const { password, projectId } = data;
  const { uid } = token;

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  return ProjectPrivateTokenRepository.returnProjectPrivateToken(
    projectId,
    password,
    uid,
  );
};
