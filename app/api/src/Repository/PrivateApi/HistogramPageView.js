/* eslint-disable sonarjs/cognitive-complexity */
const { ErrorWithProps } = require('mercurius').default;
const formatter = require('../../Utils/DateTimeFormatter');
const escaper = require('../../Utils/ClickhouseEscape');
const {
  HistogramPageViewSchema,
} = require('../../JoySchema/HistogramPageView');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class HistogramPageView {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.publicToken
   * @param {Array} params.types
   * @param {string} [params.lang]
   * @param {string} [params.startDate]
   * @param {string} [params.endDate]
   */
  async getHistogramPageView({ publicToken, types, lang, startDate, endDate }) {
    const schema = HistogramPageViewSchema();

    try {
      await schema.validateAsync(
        {
          publicToken,
          types,
          lang,
          startDate,
          endDate,
        },
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
      resolutionFormat,
      resolution,
    } = formatter('10y', startDate, endDate);

    const result = {
      query: {
        types,
        startDate: startDateProcessed,
        endDate: endDateProcessed,
        resolution,
        publicToken,
      },
      result: undefined,
    };

    /**
     * Build query
     */
    const group = 'Time';
    const selects = [`formatDateTime(Created, '${resolutionFormat}') AS Time`];
    const whereAnd = [
      `Created BETWEEN FROM_UNIXTIME(${startUnixTime}) AND FROM_UNIXTIME(${endDateUnixTime})`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 0 AND 99`,
    ];

    if (types.includes('PageView')) {
      selects.push(`count(*) AS PageView`);
    }

    if (types.includes('Users')) {
      selects.push(`count(distinct(CidUserChecksum)) AS Users`);
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
      WHERE ${whereAnd.join(' AND ')}
      GROUP BY ${group}
      ORDER BY Time DESC
      `;

    /** @type {any[]} */
    const queryResult = await this.clickHouseClient.query(query).toPromise();

    const histogram = {
      Time: [],
    };

    queryResult.map((row, i) => {
      // histogram.Time[`${i}`] = Math.round(
      //   new Date(row.CreatedMe).getTime() / 1000,
      // );
      histogram.Time[`${i}`] = new Date(row.Time);
      if (types.includes('PageView')) {
        if (!histogram.PageView) {
          histogram.PageView = [];
        }
        histogram.PageView[`${i}`] = row.PageView;
      }
      if (types.includes('Users')) {
        if (!histogram.Users) {
          histogram.Users = [];
        }
        histogram.Users[`${i}`] = row.Users;
      }
      if (types.includes('Sessions')) {
        if (!histogram.Sessions) {
          histogram.Sessions = [];
        }
        histogram.Sessions[`${i}`] = row.Sessions;
      }

      return row;
    });

    result.result = histogram;

    return result;
  }
}

module.exports = HistogramPageView;
