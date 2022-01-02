const crypto = require('crypto');
const { ErrorWithProps } = require('mercurius').default;
const {
  CreateProjectSchema: projectJoiSchema,
} = require('../../JoySchema/Project');

const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { constants: projectOption } = require('../../Schema/ProjectOption');
const { list: projectRule } = require('../../Schema/ProjectRules');
const SequelizeErrorHandler = require('../../Utils/SequelizeErrorHandler');

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
   * @param {object[]} data.userAndRules
   * @param {Number[]} data.options
   * @param {Number} data.primaryOwner
   */
  async addProject(data) {
    const {
      title,
      publicToken,
      description,
      userAndRules,
      options = [projectOption.ACTIVE],
      primaryOwner,
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

      throw new ErrorWithProps(errorConstMerge.UNPROCESSABLE_ENTITY, {
        validation: validationErrors,
        statusCode: 422,
      });
    }

    const initialValues = {
      title,
      description: description || null,
      options,
      privateToken: null,
      publicToken: null,
      primaryOwner: null,
      enabled: true,
    };
    const middleTable = {
      userAndRules: null,
    };

    if (publicToken) {
      initialValues.publicToken = publicToken;
    } else {
      initialValues.publicToken = this.generatePublicToken();
    }
    initialValues.privateToken = this.generatePrivateToken();
    initialValues.primaryOwner = primaryOwner;

    userAndRules.forEach((element) => {
      const valid = element.rules.every((elem) => projectRule.includes(elem));
      if (!valid) {
        throw new ErrorWithProps(errorConstMerge.INVALID_PROJECT_RULE, {
          statusCode: 422,
        });
      }
    });

    if (userAndRules) {
      middleTable.userAndRules = userAndRules;
    }

    /**
     ***
     *** INSERT ***
     ***
     */
    const t = await this.sequelize.transaction();
    const { Project, UserProject } = this.sequelize.models;
    let result;

    try {
      const project = await Project.create(initialValues, { transaction: t });

      const readyData = middleTable.userAndRules.map((obj) => ({
        ...obj,
        ProjectId: project.dataValues.id,
      }));

      await UserProject.bulkCreate(readyData, {
        transaction: t,
      });

      await t.commit();

      result = project.dataValues;
    } catch (error) {
      await t.rollback();
      SequelizeErrorHandler(error);
    }
    return result;
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

  /**
   *
   * @param {*} projectId
   * @returns
   */
  async regeneratePrivateToken(projectId) {
    const { Project } = this.sequelize.models;
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new ErrorWithProps(errorConstMerge.NOT_EXIST, {
        statusCode: 404,
      });
    }
    project.privateToken = this.generatePrivateToken();
    await project.save();
    return project.dataValues;
  }
}

module.exports = ProjectCreate;
