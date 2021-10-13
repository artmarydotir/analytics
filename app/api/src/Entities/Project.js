const { DataTypes } = require('sequelize');

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = (sequelize) =>
  sequelize.define(
    'Project',
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
      privateToken: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      publicToken: {
        type: DataTypes.CHAR(12),
        unique: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
      additional: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      // usersLst: {
      //   type: DataTypes.ARRAY(DataTypes.INTEGER),
      //   allowNull: true,
      // },
    },
    {
      // Other model options go here
    },
  );
