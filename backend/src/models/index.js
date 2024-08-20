const { Sequelize } = require('sequelize');
const config = require('../config/config'); 

// Configuração do ambiente
const environment = process.env.NODE_ENV || 'development';
const configEnv = config[environment];

// Inicialização do Sequelize
const sequelize = new Sequelize(
  configEnv.database,
  configEnv.username,
  configEnv.password,
  configEnv
);

const db = {};

// Importa os modelos
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.User = require('./userModel')(sequelize, Sequelize.DataTypes);
db.Expense = require('./expenseModel')(sequelize, Sequelize.DataTypes);
db.Income = require('./incomeModel')(sequelize, Sequelize.DataTypes);

// Relacionamentos (se houver)

module.exports = db;