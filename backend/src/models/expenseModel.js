const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Expense', {
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
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('tags');
        return rawValue ? rawValue.split(',').map(tag => tag.trim()) : [];
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('tags', value.join(', '));
        } else {
          this.setDataValue('tags', value);
        }
      }
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};