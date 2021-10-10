const { uniq } = require('lodash');
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const {
  CreateProjectSchema: projectJoiSchema,
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
      userAndRoles,
      options,
      additional,
    } = data;

    const schema = projectJoiSchema();
    let changeDomainInability = false;

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

      throw new ErrorWithProps('UnProcessable Entity', {
        validation: validationErrors,
        statusCode: 422,
      });
    }

    const initialValues = {
      title: null,
    };

    const middleTable = {
      userAndRoles: null,
    };

    initialValues.title = title;

    if (publicToken) {
      initialValues.publicToken = publicToken;
    }

    if (options) {
      const newOption = await this.retrieveProjectOptions(id, options);
      initialValues.options = newOption;
      if (newOption.includes(projectOption.DELETED)) {
        changeDomainInability = true;
        initialValues.enabled = false;
      }
    }

    if (description) {
      initialValues.description = description;
    }

    if (additional) {
      initialValues.additional = additional;
    }

    if (userAndRoles) {
      middleTable.userAndRoles = userAndRoles;
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

      // demoralizing
      if (changeDomainInability) {
        await Domain.update(
          { enabled: false },
          {
            where: {
              ProjectId: id,
            },
            transaction: t,
          },
        );
      }

      const readyData = middleTable.userAndRoles.map((obj) => ({
        ...obj,
        ProjectId: id,
      }));

      await UserProject.bulkCreate(readyData, {
        // not sure if its needed
        where: {
          ProjectId: id,
        },
        transaction: t,
        updateOnDuplicate: ['UserId', 'role'],
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

    const affectedRow = await Project.update(
      {
        options: newOption,
      },
      {
        where: {
          id,
        },
      },
    );

    const c = await Domain.update(
      { enabled: false },
      {
        where: {
          ProjectId: id,
        },
      },
    );
    console.log(c);

    return { affectedRow, id };
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
}

module.exports = ProjectUpdate;
