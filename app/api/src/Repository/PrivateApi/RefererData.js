const { ErrorWithProps } = require('mercurius').default;
const formatter = require('../../Utils/DateTimeFormatter');
const escaper = require('../../Utils/ClickhouseEscape');
// const { BasePageViewCountSchema } = require('../../JoySchema/PageViewCount');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class RefererData {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.lang
   * @param {string} params.publicToken
   * @param {string} params.refererType
   * @param {string} params.refererTypeValue
   * @param {string} params.startDate
   * @param {string} params.endDate
   */
  async getRefererData({
    lang,
    publicToken,
    refererType,
    refererTypeValue,
    startDate,
    endDate,
  }) {
    const {
      startUnixTime,
      endDateUnixTime,
      startDate: startDateProcessed,
      endDate: endDateProcessed,
    } = formatter('30d', startDate, endDate);

    const result = {
      query: {
        refererType,
        refererTypeValue,
        startDate: startDateProcessed,
        endDate: endDateProcessed,
        publicToken,
      },
      result: undefined,
    };

    // build dynamic query
    const selects = [];
    let group = `PRefererURLExternalHost`;
    const whereAnd = [
      `Created BETWEEN FROM_UNIXTIME(${startUnixTime}) AND FROM_UNIXTIME(${endDateUnixTime})`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 0 AND 100`,
    ];

    if (refererType === 'SessionReferer') {
      group = `SRefererURLExternalHost`;
      selects.push(`COUNT(distinct(SRefererURLExternalHost)) AS Count`);
      selects.push(`SRefererURLExternalHost AS Host`);
      whereAnd.push(`SRefererURLExternalType = ${escaper(refererTypeValue)}`);
    } else {
      selects.push(`COUNT(distinct(PRefererURLExternalHost)) AS Count`);
      selects.push(`PRefererURLExternalHost AS Host`);
      whereAnd.push(`PRefererURLExternalType = ${escaper(refererTypeValue)}`);
    }

    if (lang) {
      whereAnd.push(`Lang = ${escaper(lang)}`);
      result.query.lang = lang;
    }

    const query = `
      SELECT
        ${selects.join(', ')}
      FROM Records
      WHERE ${whereAnd.join(' AND ')}
      GROUP BY ${group}`;

    const queryResult = await this.clickHouseClient.query(query).toPromise();

    [result.result] = queryResult;

    return result;
  }
}

module.exports = RefererData;
