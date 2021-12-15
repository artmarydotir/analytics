const { ErrorWithProps } = require('mercurius').default;

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

module.exports = async (_, { data }, { container, token }) => {
  const { GravatarRepository } = container;
  const { email } = data;

  if (!token) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }

  return GravatarRepository.createEmailHash(email);
};
