const { uniq } = require('lodash');
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const {
  UpdateProjectSchema: projectJoiSchema,
} = require('../../JoySchema/Project');

const { constants: projectOption } = require('../../Schema/ProjectOption');

class ProjectUpdate {
  constructor({ sequelize }) {
    this.sequelize = sequelize;
  }

  async updateProject(id, data) {
    const {
      title,
      publicToken,
      description,
      userAndRules,
      options,
      primaryOwner,
    } = data;

    const schema = projectJoiSchema();

    let changeDomainStatus = false;

    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

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
      title: null,
    };

    const middleTable = {
      userAndRules: null,
    };

    initialValues.title = title;

    if (publicToken) {
      initialValues.publicToken = publicToken;
    }

    if (options) {
      const newOption = await this.retrieveProjectOptions(id, options);
      initialValues.options = newOption;

      if (
        newOption.includes(projectOption.DELETED) ||
        !newOption.includes(projectOption.ACTIVE)
      ) {
        // systematic  enabled
        changeDomainStatus = false;
        initialValues.enabled = false;
      } else {
        // systematic  enabled
        changeDomainStatus = true;
        initialValues.enabled = true;
      }
    }

    if (description) {
      initialValues.description = description;
    }

    if (primaryOwner) {
      initialValues.primaryOwner = primaryOwner;
    }

    if (userAndRules) {
      middleTable.userAndRules = userAndRules;
    }

    /**
     ***
     *** UPDATE ***
     ***
     */
    const t = await this.sequelize.transaction();
    const { Project, UserProject, Domain } = this.sequelize.models;
    try {
      const project = await Project.update(initialValues, {
        where: {
          id,
        },
        transaction: t,
      });

      // demoralizing systematic enabled
      await Domain.update(
        { enabled: changeDomainStatus },
        {
          where: {
            ProjectId: id,
          },
          transaction: t,
        },
      );

      const readyData = middleTable.userAndRules.map((obj) => ({
        ...obj,
        ProjectId: id,
      }));

      await UserProject.destroy({ where: { ProjectId: id }, transaction: t });

      await UserProject.bulkCreate(readyData, {
        transaction: t,
        updateOnDuplicate: ['UserId', 'rules'],
      });

      await t.commit();

      return { affectedRow: project, projectId: id };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async patchProjectOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { Project, Domain } = this.sequelize.models;
    const project = await Project.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = project.dataValues.options;

    Object.keys(props).forEach((name) => {
      const booleanStatus = props[`${name}`];
      const value = projectOption[`${name}`];
      if (booleanStatus) {
        newOption.push(value);
      } else {
        newOption = newOption.filter((v) => v !== value);
      }
    });

    newOption = uniq(newOption);

    const initialValues = {
      options: newOption,
    };

    let domainStatus = null;

    if (
      newOption.includes(projectOption.DELETED) ||
      !newOption.includes(projectOption.ACTIVE)
    ) {
      initialValues.enabled = false;
      initialValues.options = newOption;
      domainStatus = false;
    } else {
      initialValues.enabled = true;
      initialValues.options = newOption;
      domainStatus = true;
    }

    /**
     ***
     *** UPDATE ***
     ***
     */
    const t = await this.sequelize.transaction();

    try {
      const affectedRow = await Project.update(initialValues, {
        where: {
          id,
        },
        transaction: t,
      });

      // change enable mood for domain of this project
      await Domain.update(
        { enabled: domainStatus },
        {
          where: {
            ProjectId: id,
          },
          transaction: t,
        },
      );

      await t.commit();

      return { affectedRow, projectId: id };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async retrieveProjectOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { Project } = this.sequelize.models;
    const project = await Project.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = project.dataValues.options;

    // eslint-disable-next-line sonarjs/no-identical-functions
    Object.keys(props).forEach((name) => {
      const booleanStatus = props[`${name}`];
      const value = projectOption[`${name}`];
      if (booleanStatus) {
        newOption.push(value);
      } else {
        newOption = newOption.filter((v) => v !== value);
      }
    });

    newOption = uniq(newOption);

    return newOption;
  }

  /**
   *
   * @param {*} projectId
   * @param {*} userAndRules
   */
  async updateRulesByClient(projectId, userAndRules) {
    if (!projectId || !userAndRules) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { UserProject } = this.sequelize.models;
    const readyData = userAndRules.map((obj) => ({
      ...obj,
      ProjectId: projectId,
    }));

    await UserProject.destroy({ where: { ProjectId: projectId } });

    await UserProject.bulkCreate(readyData, {
      updateOnDuplicate: ['UserId', 'rules'],
    });

    return projectId;
  }
}

module.exports = ProjectUpdate;
