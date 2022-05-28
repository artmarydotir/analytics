const { ErrorWithProps } = require('mercurius').default;
const formatter = require('../../Utils/DateTimeFormatter');
const minMaxNumber = require('../../Utils/MinMaxNumber');
const escaper = require('../../Utils/ClickhouseEscape');
// const { RefererDataSchema } = require('../../JoySchema/RefererData');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class TopUrls {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {Object} params
   * @param {String} params.publicToken
   * @param {String} [params.lang]
   * @param {String} [params.type]
   * @param {String} [params.startDate]
   * @param {String} [params.endDate]
   * @param {Number} [params.limit]
   */
  async getTopUrls({ lang, publicToken, type, startDate, endDate, limit }) {
    const {
      startUnixTime,
      endDateUnixTime,
      startDate: startDateProcessed,
      endDate: endDateProcessed,
    } = formatter('1y', startDate, endDate);

    const maxLimit = minMaxNumber(limit, 1, 200);

    const result = {
      query: {
        type,
        startDate: startDateProcessed,
        endDate: endDateProcessed,
        publicToken,
        limit: maxLimit,
      },
      result: undefined,
    };

    // build dynamic query
    const selects = [];
    let group = `PCanonicalURLChecksum`;
    const whereAnd = [
      `Created BETWEEN FROM_UNIXTIME(${startUnixTime}) AND FROM_UNIXTIME(${endDateUnixTime})`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 0 AND 99`,
    ];

    if (type === 'CanonicalURL') {
      result.query.type = 'CanonicalURL';
      selects.push(`COUNT(*) AS Count`);
      selects.push(`any(PTitle) AS Title`);
      selects.push(`any(PCanonicalURL) AS URL`);
    } else {
      group = `PURLChecksum`;
      result.query.type = 'URL';
      selects.push(`COUNT(*) AS Count`);
      selects.push(`any(PTitle) AS Title`);
      selects.push(`any(PURL) AS URL`);
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
      GROUP BY ${group}
      ORDER BY Count DESC
      LIMIT ${maxLimit}
      `;

    console.log(query);

    result.result = await this.clickHouseClient.query(query).toPromise();

    return result;
  }
}

module.exports = TopUrls;