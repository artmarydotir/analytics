// @ts-nocheck
const { DataTypes } = require('sequelize');

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = (sequelize) =>
  sequelize.define(
    'PerformanceMonitor',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      interval: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Other model options go here
    },
  );
