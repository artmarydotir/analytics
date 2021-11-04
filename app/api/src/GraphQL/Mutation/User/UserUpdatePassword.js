const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { UserProcessRepository, UserUpdateMemberPasswordRepository } =
    container;
  const { id, currentPassword, newPassword } = data;

  if (!token) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  if (token.roles === userRoles.SUPERADMIN) {
    try {
      return await UserProcessRepository.resetUserPassword(id, newPassword);
    } catch (e) {
      throw new ErrorWithProps(e.message, {
        statusCode: e.extensions ? e.extensions.statusCode : 500,
        message: e.extensions ? e.extensions.validation : '',
      });
    }
  } else {
    try {
      return await UserUpdateMemberPasswordRepository.setMemberPassword(
        id,
        currentPassword,
        newPassword,
      );
    } catch (e) {
      throw new ErrorWithProps(e.message, {
        statusCode: e.extensions ? e.extensions.statusCode : 500,
        message: e.extensions ? e.extensions.validation : '',
      });
    }
  }
};
