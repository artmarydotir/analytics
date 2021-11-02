const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { id, data }, { container, token }) => {
  const { UserUpdateRepository } = container;

  if (!token) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  if (token.roles === userRoles.SUPERADMIN) {
    try {
      return await UserUpdateRepository.updateUserBySuperAdmin(id, data);
    } catch (e) {
      throw new ErrorWithProps(e.message, {
        statusCode: e.extensions ? e.extensions.statusCode : 500,
        message: e.extensions ? e.extensions.validation : '',
      });
    }
  } else {
    try {
      return await UserUpdateRepository.updateUserByMembers(id, data);
    } catch (e) {
      throw new ErrorWithProps(e.message, {
        statusCode: e.extensions ? e.extensions.statusCode : 500,
        message: e.extensions ? e.extensions.validation : '',
      });
    }
  }
};
