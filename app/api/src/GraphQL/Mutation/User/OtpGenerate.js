const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');
const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { OtpGeneratorRepository } = container;
  const { id, currentPassword } = data;

  if (!token) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  if (token.roles !== userRoles.SUPERADMIN) {
    throw new ErrorWithProps('Must enter current password.', {
      statusCode: 400,
    });
  }

  return OtpGeneratorRepository.generateNewOtp(id, currentPassword);
};
