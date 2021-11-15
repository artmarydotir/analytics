const { fieldsMap } = require('graphql-fields-list');
const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../../../Schema/UserRoles');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { args }, { container, token }, info) => {
  const { lastSeen, filter, limit } = args;

  const { ProjectListRepository } = container;

  const docFieldsMap = fieldsMap(info).docs;
  const selectedAttribute = docFieldsMap
    ? Object.keys(fieldsMap(info).docs)
    : ['id', 'title', 'options'];

  if (!token) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  if (token.roles === userRoles.VIEWER) {
    console.log('viewer');
  }

  const list = await ProjectListRepository.fetchProjectList({
    lastSeen,
    filter,
    limit,
    attributes: selectedAttribute,
  });

  if (!list) {
    throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
      statusCode: 404,
    });
  }

  return list;
};
