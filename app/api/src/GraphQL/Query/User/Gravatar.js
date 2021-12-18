const { constants: userRoles } = require('../../../Schema/UserRoles');

const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { data }, { container, token }) => {
  const { GravatarRepository } = container;
  const { email } = data;

  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  return GravatarRepository.createEmailHash(email);
};
