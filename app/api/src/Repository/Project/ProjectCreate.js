const crypto = require('crypto');
const { ErrorWithProps } = require('mercurius').default;
const {
  CreateProjectSchema: projectJoiSchema,
} = require('../../JoySchema/Project');

const { constants: projectOption } = require('../../Schema/ProjectOption');

class ProjectCreate {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
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
      options = [projectOption.ACTIVE],
      additional = {},
    } = data;

    const schema = projectJoiSchema();

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
      enabled: true,
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
     *** INSERT ***
     ***
     */
    const t = await this.sequelize.transaction();
    const { Project, UserProject } = this.sequelize.models;
    try {
      const project = await Project.create(initialValues, { transaction: t });

      const readyData = middleTable.userAndRoles.map((obj) => ({
        ...obj,
        ProjectId: project.dataValues.id,
      }));

      await UserProject.bulkCreate(readyData, {
        transaction: t,
      });

      await t.commit();

      return project.dataValues;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  generatePrivateToken() {
    return crypto
      .randomBytes(48)
      .toString('base64')
      .replace(/[^a-z0-9]/gi, '')
      .substr(0, 32);
  }

  // eslint-disable-next-line class-methods-use-this
  generatePublicToken() {
    return crypto
      .randomBytes(48)
      .toString('base64')
      .replace(/[^a-z0-9]/gi, '')
      .substr(0, 12);
  }
}

module.exports = ProjectCreate;
