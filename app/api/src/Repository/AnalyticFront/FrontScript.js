const { readFile } = require('fs').promises;

const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class FrontScript {
  constructor({ sequelize, Config }) {
    this.sequelize = sequelize;
    this.Config = Config;
  }

  /**
   *
   * @param {String} publicID
   * @returns {Promise<object>}
   */

  async generateScript(publicID) {
    if (!publicID) {
      throw new ErrorWithProps(
        errorConstMerge.ISREQUIRE_ID,
        {
          statusCode: 400,
        },
        400,
      );
    }

    const { Project } = this.sequelize.models;
    const project = await Project.findOne({
      where: {
        publicToken: publicID,
      },
    });

    if (!project) {
      throw new ErrorWithProps(
        errorConstMerge.NOT_EXIST,
        {
          statusCode: 404,
        },
        404,
      );
    }

    const info = {
      i: publicID,
      s: this.Config.ASM_COLLECTOR_SERVER_HOST,
    };

    const script = await readFile('build-assets/script.js', 'utf8');

    return script.replace('__INITIALIZE_DATA__', JSON.stringify(info));
  }
}

module.exports = FrontScript;
