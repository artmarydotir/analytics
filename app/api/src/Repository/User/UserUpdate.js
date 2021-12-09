const { uniq } = require('lodash');
const { Op } = require('sequelize');
const validator = require('validator').default;
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

const { constants: userOption } = require('../../Schema/UserOption');
const {
  UpdateUserSchemaSA: updateJoiSchemaSA,
  UpdateUserSchemaME: updateJoiSchemaME,
} = require('../../JoySchema/User');

class UserUpdate {
  constructor({ sequelize, UserProcessRepository }) {
    this.sequelize = sequelize;
    this.process = UserProcessRepository;
  }

  /**
   * @param {Number} id
   * @param {Object} data
   * @param {String} data.username
   * @param {String} data.email
   * @param {String} data.role
   * @param {String} data.lang
   * @param {Object.<string, boolean>} data.options
   * @param {String} data.country
   * @param {String} data.mobile
   * @param {Object} data.additional
   */

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async updateUserBySuperAdmin(id, data) {
    const {
      username,
      email,
      role,
      lang,
      options,
      country,
      mobile,
      additional,
    } = data;

    const schema = updateJoiSchemaSA();

    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const isUserExist = await this.process.userExistNotOptionCheck(id);

    if (isUserExist) {
      await this.validateShema(schema, data);
    }

    const initialValues = {
      username: null,
    };

    initialValues.username = username.toLowerCase();

    if (email && validator.isEmail(email)) {
      initialValues.email = validator.normalizeEmail(email);
    }

    initialValues.role = role;

    initialValues.lang = lang;

    initialValues.country = country;

    if (mobile) {
      const validMobile = this.process.setMobile(mobile, country);
      if (validMobile) {
        initialValues.mobile = validMobile;
      } else {
        throw new ErrorWithProps(errorConstMerge.INVALID_MOBILE, {
          statusCode: 400,
        });
      }
    }

    let inabilityStatus = false;
    if (options) {
      const getOptions = await this.retrieveUserOptions(id, options);
      initialValues.options = getOptions;
      if (
        getOptions.includes(userOption.DELETED) ||
        !getOptions.includes(userOption.ACTIVE)
      ) {
        inabilityStatus = false;
      } else {
        inabilityStatus = true;
      }
    }

    let owners = [];
    if (inabilityStatus === false) {
      owners = await this.findPrimaryOwnerOfProject(id);
    }

    if (additional && typeof additional === 'object') {
      initialValues.additional = additional;
    }

    /**
     ***
     *** UPDATE ***
     ***
     */

    const t = await this.sequelize.transaction();
    const { User, Project, Domain, UserProject } = this.sequelize.models;

    try {
      await User.update(initialValues, {
        where: {
          id,
        },
        transaction: t,
      });

      if (owners.length > 0) {
        await Project.update(
          { enabled: inabilityStatus },
          {
            where: {
              id: {
                [Op.in]: owners,
              },
            },
            transaction: t,
          },
        );
        await Domain.update(
          { enabled: inabilityStatus },
          {
            where: {
              ProjectId: {
                [Op.in]: owners,
              },
            },
            transaction: t,
          },
        );
        // Also delete this user from user projects rules

        await UserProject.destroy({
          where: { UserId: id },
          transaction: t,
        });
      }
      if (inabilityStatus === false) {
        await UserProject.destroy({
          where: { UserId: id },
          transaction: t,
        });
      }

      await t.commit();

      return id;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * @param {Number} id
   * @param {Object} data
   * @param {String} data.username
   * @param {String} data.email
   * @param {String} data.lang
   * @param {String} data.country
   * @param {String} data.mobile
   * @param {Object} data.additional
   */
  async updateUserByMembers(id, data) {
    const { username, email, lang, country, mobile, additional } = data;

    const schema = updateJoiSchemaME();

    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const isUserExist = await this.process.isUserExistByID(id);

    if (isUserExist) {
      await this.validateShema(schema, data);
    }

    const initialValues = {
      username: null,
    };

    initialValues.username = username.toLowerCase();

    if (email && validator.isEmail(email)) {
      initialValues.email = validator.normalizeEmail(email);
    }

    initialValues.lang = lang;

    if (country) {
      initialValues.country = country;
    }

    if (mobile) {
      const validMobile = this.process.setMobile(mobile, country);
      if (validMobile) {
        initialValues.mobile = validMobile;
      } else {
        throw new ErrorWithProps(errorConstMerge.INVALID_MOBILE, {
          statusCode: 400,
        });
      }
    }

    if (additional && typeof additional === 'object') {
      initialValues.additional = additional;
    }

    /**
     ***
     *** UPDATE ***
     ***
     */

    const { User } = this.sequelize.models;

    await User.update(initialValues, {
      where: {
        id,
      },
    });

    return id;
  }

  // eslint-disable-next-line class-methods-use-this
  async validateShema(schema, data) {
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
  }

  /**
   *
   * @param {Number} id
   * @param {Object.<string, boolean>} props
   */

  async patchUserOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    let inabilityStatus = false;
    const getOptions = await this.retrieveUserOptions(id, props);

    if (
      getOptions.includes(userOption.DELETED) ||
      !getOptions.includes(userOption.ACTIVE)
    ) {
      inabilityStatus = false;
    } else {
      inabilityStatus = true;
    }

    let owners = [];
    if (inabilityStatus === false) {
      owners = await this.findPrimaryOwnerOfProject(id);
    }

    const t = await this.sequelize.transaction();
    const { User, Project, Domain, UserProject } = this.sequelize.models;

    try {
      await User.update(
        {
          options: getOptions,
        },
        {
          where: {
            id,
          },
          transaction: t,
        },
      );
      if (owners.length > 0) {
        await Project.update(
          { enabled: inabilityStatus },
          {
            where: {
              id: {
                [Op.in]: owners,
              },
            },
            transaction: t,
          },
        );
        await Domain.update(
          { enabled: inabilityStatus },
          {
            where: {
              ProjectId: {
                [Op.in]: owners,
              },
            },
            transaction: t,
          },
        );

        await UserProject.destroy({
          where: { UserId: id },
          transaction: t,
        });
      }
      // Remove this user from user projects rules.
      if (inabilityStatus === false) {
        await UserProject.destroy({
          where: { UserId: id },
          transaction: t,
        });
      }

      await t.commit();

      return id;
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
  async retrieveUserOptions(id, props) {
    if (!id) {
      throw new ErrorWithProps(errorConstMerge.ISREQUIRE_ID, {
        statusCode: 400,
      });
    }

    const { User } = this.sequelize.models;
    const user = await User.findOne({
      attributes: ['options'],
      where: {
        id,
      },
    });

    let newOption = user.dataValues.options;

    Object.keys(props).forEach((name) => {
      const booleanStatus = props[`${name}`];
      const value = userOption[`${name}`];
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
   * @param {Number} userId
   * @returns {Promise<Array>}
   */
  async getProjectListBelongsUser(userId) {
    const { UserProject } = this.sequelize.models;
    const readyProjectList = [];

    const projectList = await UserProject.findAll({
      attributes: ['ProjectId'],
      where: {
        UserId: userId,
      },
    });

    projectList.forEach((element) => {
      readyProjectList.push(element.dataValues.ProjectId);
    });

    return readyProjectList;
  }

  /**
   *
   * @param {Number} userId
   * @returns {Promise<Array>}
   */
  async findPrimaryOwnerOfProject(userId) {
    const { Project } = this.sequelize.models;
    const list = [];

    const projectList = await Project.findAll({
      attributes: ['id'],
      where: {
        primaryOwner: userId,
      },
    });

    projectList.forEach((element) => {
      list.push(element.dataValues.id);
    });

    return list;
  }
}

module.exports = UserUpdate;
