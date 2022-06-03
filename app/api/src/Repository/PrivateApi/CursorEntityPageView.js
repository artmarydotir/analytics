const { ErrorWithProps } = require('mercurius').default;
const cursorFormatter = require('../../Utils/CursorFormatter');
const escaper = require('../../Utils/ClickhouseEscape');
const {
  BaseCursorPageViewCountSchema,
} = require('../../JoySchema/CursorPageViewCount');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class CursorEntityPageView {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  /**
   *
   * @param {Object} params
   * @param {String} params.publicToken
   * @param {String} params.entityModule
   * @param {String} [params.cursorID]
   */
  async getCursorEntityPv({ cursorID, publicToken, entityModule }) {
    const schema = BaseCursorPageViewCountSchema();

    try {
      await schema.validateAsync(
        { publicToken, entityModule, cursorID },
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

    const result = {
      query: {
        cursorID,
        publicToken,
        entityModule,
      },
      result: {
        cursorID: null,
        items: null,
      },
    };

    let cursorValue = '';
    if (cursorID) {
      cursorValue = cursorFormatter(cursorID);
    } else {
      const [{ LastCursorID }] = await this.clickHouseClient
        .query(
          `SELECT MAX(CursorID)
            AS LastCursorID
            FROM Records;`,
        )
        .toPromise();

      result.result.cursorID = LastCursorID;
      return result;
    }

    /**
     * Build query
     */
    const selects = [
      `COUNT(*) AS Count`,
      `PEntityID`,
      `MAX(CursorID) AS LastCursorID`,
    ];
    const group = `PEntityID`;
    const whereAnd = [
      `CursorID > ${escaper(cursorValue)}`,
      `PEntityModule = ${escaper(entityModule)}`,
      `PublicInstanceID = ${escaper(publicToken)}`,
      `Mode BETWEEN 0 AND 99`,
    ];

    const query = `
        SELECT
          ${selects.join(', ')}
        FROM Records
        WHERE ${whereAnd.join(' AND ')}
        GROUP BY ${group}
      `;

    const rows = await this.clickHouseClient.query(query).toPromise();

    let maxCurserID = 0;

    result.result.items = rows.map((item) => {
      if (item.LastCursorID > maxCurserID) {
        maxCurserID = item.LastCursorID;
      }

      // eslint-disable-next-line no-param-reassign
      delete item.LastCursorID;
      return item;
    });

    result.result.cursorID = maxCurserID;

    return result;
  }
}

module.exports = CursorEntityPageView;
