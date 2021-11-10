const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { id, data }, { container, token }) => {
  const { ProjectUpdateRepository } = container;

  console.log(id, data);
  console.log('--------------');
  if (!token && token.roles === userRoles.VIEWER) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  try {
    return await ProjectUpdateRepository.updateProject(id, data);
  } catch (e) {
    throw new ErrorWithProps(e.message, {
      statusCode: e.extensions ? e.extensions.statusCode : 500,
      message: e.extensions ? e.extensions.validation : '',
    });
  }
};
