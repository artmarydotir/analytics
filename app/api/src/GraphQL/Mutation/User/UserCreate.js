const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { UserCreateRepository } = container;

  if (!token || token.roles !== userRoles.SUPERADMIN) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  try {
    const user = await UserCreateRepository.addUser(data);
    return user.dataValues;
  } catch (e) {
    throw new ErrorWithProps(e.message, {
      statusCode: e.extensions ? e.extensions.statusCode : 500,
    });
  }
};
