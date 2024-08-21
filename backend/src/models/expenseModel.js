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
    tag: {
      type: DataTypes.ENUM(
        'Alimentação',
        'Transporte',
        'Saúde',
        'Educação',
        'Lazer',
        'Moradia',
        'Imprevisto',
        'Cuidados Pessoais'
      ),
      allowNull: false,
    }
  }, {
    tableName: 'expenses',
    timestamps: true,
  });

  return Expense;
};