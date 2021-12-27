const { uniq } = require('lodash');
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const {
  CreateProjectSchema: projectJoiSchema,
} = require('../../JoySchema/Project');

const { constants: projectOption } = require('../../Schema/ProjectOption');

class UptimeUpdate {
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
      additional,
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

    if (additional) {
      initialValues.additional = additional;
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
  async patchUptimeOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { Uptime } = this.sequelize.models;
    const uptime = await Uptime.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = uptime.dataValues.options;

    console.log(newOption);
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

    console.log(newOption, '--');

    const initialValues = {
      options: newOption,
    };

    /**
     ***
     *** UPDATE ***
     ***
     */

    const affectedRow = await Uptime.update(initialValues, {
      where: {
        id,
      },
    });

    return { affectedRow, uptimeId: id };
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */
  async retrieveUptimeOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { Uptime } = this.sequelize.models;
    const uptime = await Uptime.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = uptime.dataValues.options;

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
}

module.exports = UptimeUpdate;
