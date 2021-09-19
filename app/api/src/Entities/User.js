const { DataTypes } = require('sequelize');

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = (sequelize) =>
  sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otpSecret: {
        type: DataTypes.CHAR(20),
        allowNull: false,
      },
      role: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
      lang: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
      country: {
        type: DataTypes.CHAR(2),
        allowNull: true,
      },
      mobile: {
        type: DataTypes.STRING(24),
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
    },
    {
      // setterMethods: {
      //   revokeOTPSecret() {
      //     this.setDataValue('otpSecret', authenticator.generateSecret(12));
      //   },
      // },
      // Other model options go here
    },
  );
