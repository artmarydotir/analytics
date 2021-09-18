/* eslint-disable class-methods-use-this */
const crypto = require('crypto');
const { ErrorWithProps } = require('mercurius').default;
const {
  CreateProjectSchema: projectJoiSchema,
} = require('../../JoySchema/Project');

class CreateProject {
  constructor({ pgClient }) {
    /**
     * @private
     * @type {import('pg').Client}
     */
    this.pg = pgClient;
  }

  /**
   *
   * @param {Object} data
   * @param {String} data.title
   * @param {String} data.publicToken
   * @param {String} data.description
   * @param {object[]} data.userAndRoles
   * @param {Number[]} data.options
   * @param {Object} data.additional
   */
  async addProject(data) {
    const {
      title,
      publicToken,
      description,
      userAndRoles,
      options = [1],
      additional = {},
    } = data;

    const schema = projectJoiSchema();

    // console.log(role);
    try {
      await schema.validateAsync(data, { abortEarly: false });
    } catch (e) {
      const validationErrors = [];
      e.details.forEach((element) => {
        validationErrors.push({
          message: element.message,
          field: element.context.label,
        });
      });

      throw new ErrorWithProps('UnProcessable Entity', {
        validation: validationErrors,
        statusCode: 422,
      });
    }

    const initialValues = {
      title: null,
      description: null,
      options: null,
      privateToken: null,
      publicToken: null,
      additional: null,
    };
    const middleTable = {
      userAndRoles: null,
    };

    initialValues.title = title;
    if (description) {
      initialValues.description = description;
    }
    if (options) {
      initialValues.options = options;
    }
    if (additional) {
      initialValues.additional = additional;
    }
    if (publicToken) {
      initialValues.publicToken = publicToken;
    } else {
      initialValues.publicToken = this.generatePublicToken();
    }
    initialValues.privateToken = this.generatePrivateToken();

    if (userAndRoles) {
      middleTable.userAndRoles = userAndRoles;
    }

    /**
     ***
     *** QUERY BUILDING ***
     ***
     */

    try {
      await this.pg.query('BEGIN');
      const projectQuery = `INSERT INTO projects(${Object.keys(
        initialValues,
      ).join(',')}) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`;

      const queryValues = Object.values(initialValues);

      const res = await this.pg.query(projectQuery, queryValues);

      const insertPromises = [];
      middleTable.userAndRoles.forEach((element) => {
        const queryText =
          'INSERT INTO user_project(user_id, project_id, role) VALUES ($1, $2, $3)';
        const queryValue = [element.userID, res.rows[0].id, element.roles];
        insertPromises.push(this.pg.query(queryText, queryValue));
      });

      Promise.all(insertPromises);
      await this.pg.query('COMMIT');
    } catch (e) {
      await this.pg.query('ROLLBACK');
      throw e;
    }
  }

  generatePrivateToken() {
    return crypto
      .randomBytes(48)
      .toString('base64')
      .replace(/[^a-z0-9]/gi, '')
      .substr(0, 32);
  }

  generatePublicToken() {
    return crypto
      .randomBytes(48)
      .toString('base64')
      .replace(/[^a-z0-9]/gi, '')
      .substr(0, 12);
  }
}

module.exports = CreateProject;
