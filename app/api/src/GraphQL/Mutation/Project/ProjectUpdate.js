const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { id, data }, { container, token }) => {
  const { ProjectUpdateRepository } = container;

  if (!token && token.roles === userRoles.VIEWER) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  try {
    const projectData = await ProjectUpdateRepository.updateProject(id, data);
    return projectData.projectId;
  } catch (e) {
    throw new ErrorWithProps(e.message, {
      statusCode: e.extensions ? e.extensions.statusCode : 500,
      message: e.extensions ? e.extensions.validation : '',
    });
  }
};
