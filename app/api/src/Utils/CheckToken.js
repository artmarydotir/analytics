const { ErrorWithProps } = require('mercurius').default;

const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

/**
 *
 * @param {Object<string, any>} token
 * @param {String[]} andRoles
 * @param {String[]} orRoles
 */
module.exports = (token, andRoles = [], orRoles = []) => {
  if (!token) {
    throw new ErrorWithProps(errorConstMerge.NOT_ALLOWED, {
      statusCode: 405,
    });
  }

  let access = false;

  if (andRoles.length > 0) {
    access = true;
    for (let i = 0; i < andRoles.length; i += 1) {
      const role = andRoles[`${i}`];
      if (token.roles !== role) {
        access = false;
        break;
      }
    }
  }
  if (orRoles.length > 0) {
    access = false;
    for (let i = 0; i < orRoles.length; i += 1) {
      const role = orRoles[`${i}`];
      if (token.roles === role) {
        access = true;
        break;
      }
    }
  }

  if (access === false) {
    throw new ErrorWithProps(errorConstMerge.FORBIDDEN, {
      statusCode: 403,
    });
  }
  return access;
};
