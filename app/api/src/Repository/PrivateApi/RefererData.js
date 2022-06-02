const { ErrorWithProps } = require('mercurius').default;
const formatter = require('../../Utils/DateTimeFormatter');
const minMaxNumber = require('../../Utils/MinMaxNumber');
const escaper = require('../../Utils/ClickhouseEscape');
const { RefererDataSchema } = require('../../JoySchema/RefererData');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class RefererData {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {Object} params
   * @param {String} params.publicToken
   * @param {String} [params.lang]
   * @param {String} [params.refererType]
   * @param {String} [params.startDate]
   * @param {String} [params.endDate]
   * @param {Number} [params.limit]
   */
  async getRefererData({
    lang,
    publicToken,
    refererType,
    startDate,
    endDate,
    limit,
  }) {
    const schema = RefererDataSchema();

    try {
      await schema.validateAsync(
        { publicToken, refererType, startDate, endDate, limit },
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
    } = formatter('1y', startDate, endDate);

    const maxLimit = minMaxNumber(limit, 1, 200);

    const result = {
      query: {
        refererType,
        startDate: startDateProcessed,
        endDate: endDateProcessed,
        publicToken,
        limit: maxLimit,
      },
      result: undefined,
    };

    /**
     * Build query
     */
    const selects = [];
    let group = `PRefererURLExternalName`;
    const whereAnd = [
      `Created BETWEEN FROM_UNIXTIME(${startUnixTime}) AND FROM_UNIXTIME(${endDateUnixTime})`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 0 AND 99`,
    ];

    if (refererType === 'SessionReferer') {
      group = `SRefererURLExternalName`;
      selects.push(`COUNT(*) AS Count`);
      selects.push(`any(SRefererURLExternalName) AS Name`);
      selects.push(`any(SRefererURLExternalType) AS Type`);
      whereAnd.push(`SRefererURLExternalType > 0`);
    } else {
      selects.push(`COUNT(*) AS Count`);
      selects.push(`any(PRefererURLExternalName) AS Name`);
      selects.push(`any(PRefererURLExternalType) AS Type`);
      whereAnd.push(`PRefererURLExternalType > 0`);
    }

    if (lang) {
      whereAnd.push(`PLang = ${escaper(lang)}`);
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

    result.result = await this.clickHouseClient.query(query).toPromise();

    return result;
  }
}

module.exports = RefererData;
