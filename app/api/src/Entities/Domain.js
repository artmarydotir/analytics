// @ts-nocheck
const { DataTypes } = require('sequelize');

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = (sequelize) => {
  const Project = sequelize.modelManager.getModel('Project');

  const Domain = sequelize.define(
    'Domain',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      domain: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      wildcardDomain: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      additional: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      // Other model options go here
    },
  );

  Project.hasMany(Domain);
  Domain.belongsTo(Project);

  return Domain;
};
