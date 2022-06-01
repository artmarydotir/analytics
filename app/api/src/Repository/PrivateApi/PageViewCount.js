const { ErrorWithProps } = require('mercurius').default;
const formatter = require('../../Utils/DateTimeFormatter');
const escaper = require('../../Utils/ClickhouseEscape');
const { BasePageViewCountSchema } = require('../../JoySchema/PageViewCount');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class PageViewCount {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.lang
   * @param {string} params.publicToken
   * @param {Array} params.types
   * @param {string} params.startDate
   * @param {string} params.endDate
   */
  async getPageViewCount({ publicToken, types, lang, startDate, endDate }) {
    const schema = BasePageViewCountSchema();

    try {
      await schema.validateAsync(
        { publicToken, types, startDate, endDate },
        { abortEarly: false },
      );
    } catch (e) {
      const validationErrors = [];
      e.details.forEach((element) => {
        validationErrors.push({
          message: element.message,
          field: element.context.label,
        });
      });

      throw new ErrorWithProps(
        errorConstMerge.UNPROCESSABLE_ENTITY,
        {
          validation: validationErrors,
          statusCode: 422,
        },
        422,
      );
    }

    const {
      startUnixTime,
      endDateUnixTime,
      startDate: startDateProcessed,
      endDate: endDateProcessed,
    } = formatter('30d', startDate, endDate);

    const result = {
      query: {
        types,
        startDate: startDateProcessed,
        endDate: endDateProcessed,
        publicToken,
      },
      result: undefined,
    };

    // build dynamic query
    const selects = [];
    const whereAnd = [
      `Created BETWEEN FROM_UNIXTIME(${startUnixTime}) AND FROM_UNIXTIME(${endDateUnixTime})`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 0 AND 99`,
    ];

    if (types.includes('Users')) {
      selects.push(`count(distinct(CidUserChecksum)) AS Users`);
    }

    if (types.includes('PageView')) {
      selects.push(`count(*) AS PageView`);
    }

    if (types.includes('Sessions')) {
      selects.push(`count(distinct(CidSessionChecksum)) AS Sessions`);
    }

    if (lang) {
      whereAnd.push(`PLang = ${escaper(lang)}`);
      result.query.lang = lang;
    }

    const query = `
      SELECT
        ${selects.join(', ')}
      FROM Records
      WHERE ${whereAnd.join(' AND ')}`;

    const queryResult = await this.clickHouseClient.query(query).toPromise();

    [result.result] = queryResult;

    return result;
  }
}

module.exports = PageViewCount;
