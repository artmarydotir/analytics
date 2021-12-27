const { fieldsMap } = require('graphql-fields-list');
const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { args }, { container, token }, info) => {
  const { lastSeen, filter, limit } = args;

  const { UptimeListRepository } = container;

  const docFieldsMap = fieldsMap(info).docs;
  const selectedAttribute = docFieldsMap
    ? Object.keys(fieldsMap(info).docs)
    : ['id', 'url', 'interval'];

  checkToken(token, _, [userRoles.ADMIN, userRoles.SUPERADMIN]);

  return UptimeListRepository.fetchUptimeList({
    lastSeen,
    filter,
    limit,
    attributes: selectedAttribute,
  });
};
