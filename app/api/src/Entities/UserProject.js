const { DataTypes } = require('sequelize');

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = (sequelize) => {
  const User = sequelize.modelManager.getModel('User');
  const Project = sequelize.modelManager.getModel('Project');

  const UserProject = sequelize.define('UserProject', {
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  });

  // @ts-ignore
  User.belongsToMany(Project, {
    through: UserProject,
  });
  // @ts-ignore
  Project.belongsToMany(User, {
    through: UserProject,
  });
  //
  return UserProject;
};
