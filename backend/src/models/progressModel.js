const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Progress', {
    simulationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Simulations', // Nome da tabela correta
        key: 'id'
      },
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isChecked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};