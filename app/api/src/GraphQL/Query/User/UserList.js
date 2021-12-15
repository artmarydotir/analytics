const { fieldsMap } = require('graphql-fields-list');
const checkToken = require('../../../Utils/CheckToken');

const { constants: userRoles } = require('../../../Schema/UserRoles');

module.exports = async (_, { args }, { container, token }, info) => {
  const { lastSeen, filter, limit } = args;

  const { UserListRepository } = container;

  const docFieldsMap = fieldsMap(info).docs;
  const selectedAttribute = docFieldsMap
    ? Object.keys(fieldsMap(info).docs)
    : ['id', 'email', 'role'];

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  return UserListRepository.fetchUserList({
    lastSeen,
    filter,
    limit,
    attributes: selectedAttribute,
  });
};
