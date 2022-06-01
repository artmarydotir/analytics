/* eslint-disable sql/no-unsafe-query */
class CheckQuery {
  constructor({ clickHouseClient }) {
    this.clickHouseClient = clickHouseClient;
  }

  async firstCheck() {
    const query1 = `
      SELECT
        count()
      FROM
        system.numbers
    `;

    const query2 = `
    select count(*) from Records;
    `;

    const query3 = `
    select * from Records limit 1;
    `;

    // select count(distinct(CidUserChecksum)) AS Users from Records;
    // select count(distinct(CidUserChecksum)) AS Users, count(distinct(CidSessionChecksum)) AS Sessions from Records
    //
    // SELECT
    // count(*) AS PageView,
    // countDistinct(CidUserChecksum) AS Users,
    // countDistinct(CidSessionChecksum) AS Sessions
    // FROM Records
    // WHERE (Mode > 0) AND (Mode < 100)

    // select count(*) as PageView, count(distinct(CidUserChecksum)) AS Users, count(distinct(CidSessionChecksum)) AS Sessions from  Records where PublicInstanceID='abcdef012345' AND Mode > 0 AND Mode < 100;

    /** question 10 month
     * select  count(*) as PageView, FROM_UNIXTIME(Created, '%Y-%m-00 00:00:00') Formatted
     * FROM  Records
     * where PublicInstanceID='abcdef012345' AND Mode > 0 AND Mode < 100  Group by Formatted
     */

    /**
     * day:
     * SELECT
        count(*) AS PageView,
        FROM_UNIXTIME(Created, '%Y-%m-%d 00:00:00') AS Formatted
        FROM Records
        WHERE (PublicInstanceID = 'abcdef012345') AND (Mode > 0) AND (Mode < 100) AND (CursorID > 12)
        GROUP BY Formatted
     */
    // format exp:
    // clickhouse-single :) SELECT FROM_UNIXTIME(Created, '%Y%m%d') Formatted, Created AS DateTime FROM Records LIMIT 1;
    const query4 = `
    select count(distinct( CidUserChecksum)) from Records where PublicInstanceID = 'abcdef012345';
    `;

    const result = await this.clickHouseClient.query(query4).toPromise();

    console.log('0000000000000');
    console.log(result);
    // return result;
  }
}

module.exports = CheckQuery;
