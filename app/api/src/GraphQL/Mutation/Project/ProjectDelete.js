const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { ProjectUpdateRepository } = container;
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

  try {
    const result = await ProjectUpdateRepository.patchProjectOptions(
      id,
      removingData,
    );
    return result.projectId;
  } catch (e) {
    throw new ErrorWithProps(e.message, {
      statusCode: e.extensions ? e.extensions.statusCode : 500,
      message: e.extensions ? e.extensions.validation : '',
    });
  }
};
