const { ErrorWithProps } = require('mercurius').default;
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

module.exports = (e) => {
  if (e.errors) {
    let duplicateEntry = false;
    const catchErrors = [];
    const status = 422;
    e.errors.forEach((element) => {
      catchErrors.push({
        message: element.message,
        field: element.path,
        key: element.validatorKey,
      });
      if (element.validatorKey === 'not_unique') {
        duplicateEntry = true;
      }
    });
    throw new ErrorWithProps(
      duplicateEntry
        ? errorConstMerge.DUPLICATE_ENTRY
        : errorConstMerge.OTHER_ERROR,
      {
        validation: catchErrors,
        statusCode: duplicateEntry ? status : 500,
      },
    );
  }
};
