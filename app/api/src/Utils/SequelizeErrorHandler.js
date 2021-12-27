const { ErrorWithProps } = require('mercurius').default;
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

module.exports = (e) => {
  // console.log(e.errors, '----');
  if (e.errors) {
    let duplicateEntry = false;
    let nullEntry = false;
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
      } else if (element.validatorKey === 'is_null') {
        nullEntry = true;
      }
    });
    if (duplicateEntry) {
      throw new ErrorWithProps(
        duplicateEntry
          ? errorConstMerge.DUPLICATE_ENTRY
          : errorConstMerge.OTHER_ERROR,
        {
          validation: catchErrors,
          statusCode: duplicateEntry ? status : 500,
        },
      );
    } else if (nullEntry) {
      throw new ErrorWithProps(
        nullEntry ? errorConstMerge.NULL_ENTRY : errorConstMerge.OTHER_ERROR,
        {
          validation: catchErrors,
          statusCode: nullEntry ? status : 500,
        },
      );
    }

    // finally
    throw new ErrorWithProps(errorConstMerge.OTHER_ERROR, {
      validation: catchErrors,
      statusCode: 500,
    });
  } else {
    throw new ErrorWithProps(errorConstMerge.OTHER_ERROR, {
      validation: [{ message: e.message }],
      statusCode: 500,
    });
  }
};
