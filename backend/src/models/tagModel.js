const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    timestamps: true,
  });

  // Definindo o relacionamento Many-to-Many entre Tag e Expense
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Expense, {
      through: 'ExpenseTags',
      as: 'expenses',
      foreignKey: 'tagId',
      otherKey: 'expenseId'
    });
  };

  return Tag;
};