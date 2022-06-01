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

      cursorValue = LastCursorID;
    }

    const result = {
      query: {
        cursorID,
        publicToken,
        module,
      },
      result: undefined,
    };

    console.log(cursorValue);
    // console.log(result);
    if (!cursorID) {
      result.result = {
        cursorID: cursorValue,
        items: [],
      };
    }

    // build dynamic query

    // if (cursorID) {
    //   cursorValue = cursorFormatter(cursorID);
    // } else {
    //   const cursorEntity = await this.clickHouseClient.query(`
    //     SELECT
    //     FROM Records
    //     WHERE
    //     PEntityModule = '${module}'
    //     `

    // const schema = RefererDataSchema();
    // try {
    //   await schema.validateAsync(
    //     { publicToken, refererType, startDate, endDate, limit },
    //     { abortEarly: false },
    //   );
    // } catch (e) {
    //   const validationErrors = [];
    //   e.details.forEach((element) => {
    //     validationErrors.push({
    //       message: element.message,
    //       field: element.context.label,
    //     });
    //   });
    //   throw new ErrorWithProps(
    //     errorConstMerge.UNPROCESSABLE_ENTITY,
    //     {
    //       validation: validationErrors,
    //       statusCode: 422,
    //     },
    //     422,
    //   );
    // }

    return result;
  }
}

module.exports = CursorEntityPageView;
