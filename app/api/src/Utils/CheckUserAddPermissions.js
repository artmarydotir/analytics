const { ErrorWithProps } = require('mercurius').default;
const { constants: userRoles } = require('../Schema/UserRoles');
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

/**
 *
 * @param {String} role
 */
module.exports = (role) => {
  if (!role) {
    throw new ErrorWithProps(errorConstMerge.ISREQUIRE_FIELD, {
      statusCode: 400,
    });
  }

  if (role === userRoles.ADMIN || role === userRoles.SUPERADMIN) {
    throw new ErrorWithProps(errorConstMerge.NOT_ALLOWED, {
      statusCode: 403,
    });
  }
};
