const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { UserUpdateRepository } = container;
  const { id } = data;

  if (!token || token.roles !== userRoles.SUPERADMIN) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  const removingData = {
    ACTIVE: false,
    DELETED: true,
  };

  const result = await UserUpdateRepository.patchUserOptions(id, removingData);
  return result.id;
};
