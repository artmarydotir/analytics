const { ErrorWithProps } = require('mercurius').default;
const formatter = require('../../../Utils/DateTimeFormatter');
const escaper = require('../../../Utils/ClickhouseEscape');
const { EVIdentCountSchema } = require('../../../JoySchema/EVIdentCount');

const {
  constantsMerge: errorConstMerge,
} = require('../../../Schema/ErrorMessage');

class IdentCount {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.id
   * @param {string} params.action
   * @param {string} params.category
   * @param {string} params.publicToken
   * @param {string} [params.startDate]
   * @param {string} [params.endDate]
   */
  async getEIdentCount({
    publicToken,
    id,
    action,
    category,
    startDate,
    endDate,
  }) {
    const schema = EVIdentCountSchema();

    try {
      await schema.validateAsync(
        { publicToken, startDate, endDate, id, action, category },
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
    } = formatter('192d', startDate, endDate);

    const result = {
      query: {
        id,
        action,
        category,
        startDate: startDateProcessed,
        endDate: endDateProcessed,
        publicToken,
      },
      result: undefined,
    };

    /**
     * Build query
     */
    const group = 'EIdent';
    const selects = [`count(*) as Count`];
    const whereAnd = [
      `Created BETWEEN FROM_UNIXTIME(${startUnixTime}) AND FROM_UNIXTIME(${endDateUnixTime})`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 100 AND 199`,
      `ECategory = ${escaper(category)}`,
      `EAction = ${escaper(action)}`,
      `EIdent = ${escaper(id)}`,
    ];

    const query = `
      SELECT
        ${selects.join(', ')}
      FROM Records
      WHERE ${whereAnd.join(' AND ')}
      GROUP BY ${group}
    `;

    const queryResult = await this.clickHouseClient.query(query).toPromise();

    [result.result] = queryResult;
    return result;
  }
}

module.exports = IdentCount;
