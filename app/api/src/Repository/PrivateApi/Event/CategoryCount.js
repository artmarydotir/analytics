const { ErrorWithProps } = require('mercurius').default;
const formatter = require('../../../Utils/DateTimeFormatter');
const minMaxNumber = require('../../../Utils/MinMaxNumber');
const escaper = require('../../../Utils/ClickhouseEscape');
const { EVCategoryCountSchema } = require('../../../JoySchema/EVCategoryCount');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

class CategoryCount {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.publicToken
   * @param {string} [params.startDate]
   * @param {string} [params.endDate]
   * @param {Number} [params.limit]
   */
  async getCategoryCount({ publicToken, startDate, endDate, limit }) {
    const schema = EVCategoryCountSchema();

    try {
      await schema.validateAsync(
        { publicToken, startDate, endDate, limit },
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
    const group = 'ECategory';
    const selects = [`count(*) as Count`, `ECategory as Category`];
    const whereAnd = [
      `Created BETWEEN FROM_UNIXTIME(${startUnixTime}) AND FROM_UNIXTIME(${endDateUnixTime})`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 100 AND 199`,
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
      resultMap[element.Category] = element.Count;
    });

    result.result = resultMap;

    return result;
  }
}

module.exports = CategoryCount;
