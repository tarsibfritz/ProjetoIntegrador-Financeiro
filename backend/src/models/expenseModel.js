const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Expense = sequelize.define('Expense', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    observation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  // Definindo o relacionamento Many-to-Many entre Expense e Tag
  Expense.associate = (models) => {
    Expense.belongsToMany(models.Tag, {
      through: 'ExpenseTags',
      as: 'tags',
      foreignKey: 'expenseId',
      otherKey: 'tagId'
    });
  };

  return Expense;
};