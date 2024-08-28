const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Simulation', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    totalValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    monthlySavings: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    monthsToSave: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    savedAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    goalAchieved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });
};