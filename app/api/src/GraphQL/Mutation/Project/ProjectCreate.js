const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { ProjectCreateRepository } = container;

  if (!token || token.roles === userRoles.VIEWER) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  try {
    const project = await ProjectCreateRepository.addProject(data);
    return project.id;
  } catch (e) {
    throw new ErrorWithProps(e.message, {
      statusCode: e.extensions ? e.extensions.statusCode : 500,
    });
  }
};
