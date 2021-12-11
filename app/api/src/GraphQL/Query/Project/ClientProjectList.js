const { constants: userRoles } = require('../../../Schema/UserRoles');
const checkToken = require('../../../Utils/CheckToken');

module.exports = async (_, { args }, { container, token }) => {
  const { lastSeen, filter, limit } = args;

  const { ProjectListRepository } = container;

  checkToken(token, _, [userRoles.CLIENT]);

  const list = await ProjectListRepository.fetchProjectListByOwner(token.uid, {
    lastSeen,
    filter,
    limit,
  });

  return {
    docs: list,
  };
};
