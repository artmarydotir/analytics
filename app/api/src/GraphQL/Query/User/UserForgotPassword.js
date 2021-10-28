const { ErrorWithProps } = require('mercurius').default;

module.exports = async (_, { data }, { container }) => {
  const { UserForgotPasswordRepository } = container;
  const { email } = data;

  try {
    return await UserForgotPasswordRepository.sendForgotPasswordCode(email);
  } catch (e) {
    throw new ErrorWithProps(e.message, {
      statusCode: e.extensions ? e.extensions.statusCode : 500,
    });
  }
};
