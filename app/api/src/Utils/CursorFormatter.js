const { ErrorWithProps } = require('mercurius').default;
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

const regex = /^([0-9]{8})[0-9]{9}$/;

/**
 *
 * @param {String} cursorID
 */
module.exports = (cursorID) => {
  if (!cursorID || !regex.test(cursorID)) {
    throw new ErrorWithProps(
      errorConstMerge.ISREQUIRE_ID,
      {
        statusCode: 400,
      },
      422,
    );
  }

  const [, dayPart] = cursorID.match(regex);

  // default is : 1 week ago
  const possiblePast = new Date(new Date().getTime() - 604800000)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '');

  const dayPartInt = parseInt(dayPart, 10);
  const possiblePastInt = parseInt(possiblePast, 10);

  let result = cursorID;
  if (dayPartInt < possiblePastInt) {
    result = possiblePastInt.toString().padEnd(17, '0');
  }

  return result;
};
