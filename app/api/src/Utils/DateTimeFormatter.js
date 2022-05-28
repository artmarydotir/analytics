const ms = require('ms');

const { ErrorWithProps } = require('mercurius').default;
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

const unixTimeRegex = /^[0-9]+$/;

const hourMilliseconds = 3600000;

/**
 *
 * @param {String} maxDiff
 * @param {String} [start]
 * @param {String} [end]
 */
module.exports = (maxDiff, start, end) => {
  let endDate = new Date();
  if (unixTimeRegex.test(end)) {
    endDate = new Date(parseInt(end, 10) * 1000);
  } else if (end) {
    endDate = new Date(end);
  }

  if (endDate.getTime() > Date.now()) {
    endDate = new Date();
  }

  const maxDiffMilliseconds = ms(maxDiff);

  let startDate = new Date();
  startDate.setTime(endDate.getTime() - maxDiffMilliseconds + 1000);

  if (unixTimeRegex.test(start)) {
    startDate = new Date(parseInt(start, 10) * 1000);
  } else if (start) {
    startDate = new Date(start);
  }

  const diff = endDate.getTime() - startDate.getTime();

  if (endDate.getTime() < startDate.getTime() || diff >= maxDiffMilliseconds) {
    throw new ErrorWithProps(
      errorConstMerge.INVALID_DATE_RANGE,
      {
        endDate,
        startDate,
        statusCode: 422,
      },
      422,
    );
  }

  let resolution = 'month';
  let resolutionFormat = '%Y-%m-00 12:00:00';
  if (diff < 6 * hourMilliseconds) {
    resolution = 'minute';
    resolutionFormat = '%Y-%m-%d %H:%M:00';
  } else if (diff < 24 * 7 * hourMilliseconds) {
    resolution = 'hour';
    resolutionFormat = '%Y-%m-%d %H:00:00';
  } else if (diff < 24 * 30 * hourMilliseconds) {
    resolution = 'day';
    resolutionFormat = '%Y-%m-%d 12:00:00';
  }

  return {
    resolution,
    resolutionFormat,
    startDate,
    startUnixTime: Math.round(startDate.getTime() / 1000),
    endDate,
    endDateUnixTime: Math.round(endDate.getTime() / 1000),
  };
};
