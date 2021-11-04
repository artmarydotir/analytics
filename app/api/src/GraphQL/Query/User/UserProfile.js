const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { UserProfileRepository } = container;
  const { id } = data;

  if (!token) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  if (
    !token.roles ||
    (token.roles !== userRoles.SUPERADMIN && id !== token.uid)
  ) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  const user = UserProfileRepository.returnUserData(id);

  if (!user) {
    throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
      statusCode: 404,
    });
  }

  return user;
};
