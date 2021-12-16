module.exports = async (_, { data }, { container }) => {
  const { UserForgotPasswordRepository } = container;
  const { email } = data;

  return UserForgotPasswordRepository.sendForgotPasswordCode(email);
};
