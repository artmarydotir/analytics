const { ErrorWithProps } = require('mercurius').default;

module.exports = async (_, { data }, { container }) => {
  const { id, password } = data;
  // const { ResetPasswordUserRepository } = container;
  // fake
  // try {
  //   const user = await ResetPasswordUserRepository.resetPassword(
  //     id,
  //     rawPassword,
  //   );
  //   return {
  //     id: user.id,
  //     username: user.username,
  //   };
  // } catch (e) {
  //   throw new ErrorWithProps(e.message, {
  //     statusCode: e.extensions ? e.extensions.statusCode : 500,
  //   });
  // }
};
