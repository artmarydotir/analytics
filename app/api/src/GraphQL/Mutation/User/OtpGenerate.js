const checkToken = require('../../../Utils/CheckToken');
const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { data }, { container, token }) => {
  const { OtpGeneratorRepository } = container;
  const { id, currentPassword } = data;

  checkToken(token, _, [
    userRoles.ADMIN,
    userRoles.SUPERADMIN,
    userRoles.CLIENT,
  ]);

  return OtpGeneratorRepository.generateNewOtp(id, currentPassword);
};
