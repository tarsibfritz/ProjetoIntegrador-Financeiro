const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Launch = sequelize.define('Launch', {
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
        'Salário',
        'Freelance',
        'Investimentos',
        'Outros'
      ),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('expense', 'income'),
      allowNull: false,
      validate: {
        isIn: [['expense', 'income']],
      },
    },
  }, {
    tableName: 'launches',
    timestamps: true,
  });

  return Launch;
};