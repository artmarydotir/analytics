const { ErrorWithProps } = require('mercurius').default;
const cursorFormatter = require('../../Utils/CursorFormatter');
const escaper = require('../../Utils/ClickhouseEscape');

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
   * @param {String} params.module
   * @param {String} [params.cursorID]
   */
  async getCursorEntityPv({ cursorID, publicToken, module }) {
    const result = {
      query: {
        cursorID,
        publicToken,
        module,
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
      `PEntityModule = ${escaper(module)}`,
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
