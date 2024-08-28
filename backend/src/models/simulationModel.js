const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Simulation = sequelize.define('Simulation', {
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
    goalAchieved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    progress: {
      type: DataTypes.JSON,
      defaultValue: {},  // Valor padrão como objeto vazio
      allowNull: false,
    }
  });

  return Simulation;
};