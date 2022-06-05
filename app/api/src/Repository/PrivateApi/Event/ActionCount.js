const { ErrorWithProps } = require('mercurius').default;
const formatter = require('../../../Utils/DateTimeFormatter');
const minMaxNumber = require('../../../Utils/MinMaxNumber');
const escaper = require('../../../Utils/ClickhouseEscape');
const { EVActionCountSchema } = require('../../../JoySchema/EVActionCount');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

class ActionCount {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.category
   * @param {string} params.publicToken
   * @param {string} [params.startDate]
   * @param {string} [params.endDate]
   * @param {Number} [params.limit]
   */
  async getActionCount({ publicToken, category, startDate, endDate, limit }) {
    const schema = EVActionCountSchema();

    try {
      await schema.validateAsync(
        { publicToken, startDate, endDate, category, limit },
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

    const maxLimit = minMaxNumber(limit, 1, 500);

    const result = {
      query: {
        category,
        limit: maxLimit,
        startDate: startDateProcessed,
        endDate: endDateProcessed,
        publicToken,
      },
      result: undefined,
    };

    /**
     * Build query
     */
    const group = 'EAction';
    const selects = [`count(*) as Count`, `EAction as Action`];
    const whereAnd = [
      `Created BETWEEN FROM_UNIXTIME(${startUnixTime}) AND FROM_UNIXTIME(${endDateUnixTime})`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 100 AND 199`,
      `ECategory = ${escaper(category)}`,
    ];

    const query = `
      SELECT
        ${selects.join(', ')}
      FROM Records
      WHERE ${whereAnd.join(' AND ')}
      GROUP BY ${group}
      ORDER By Count DESC
      LIMIT ${maxLimit}
      `;

    const queryResult = await this.clickHouseClient.query(query).toPromise();

    const resultMap = {};
    queryResult.forEach((element) => {
      resultMap[element.Action] = element.Count;
    });

    result.result = resultMap;
    return result;
  }
}

module.exports = ActionCount;
