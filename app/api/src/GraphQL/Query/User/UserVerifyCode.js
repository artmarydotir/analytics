const { ErrorWithProps } = require('mercurius').default;

module.exports = async (_, { data }, { container }) => {
  const { Redis } = container;
  const { code, id } = data;

  let valid = false;
  if (id) {
    const connection = await Redis.getRedis();
    const getValue = await connection.get(`forget_password:${id}`);

    if (code === getValue) {
      valid = true;
    } else {
      throw new ErrorWithProps('Code is not valid.', {
        statusCode: 400,
      });
    }
  }

  return valid;
};
