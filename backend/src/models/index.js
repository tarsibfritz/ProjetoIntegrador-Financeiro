const { Sequelize, DataTypes } = require('sequelize');
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
db.Launch = require('./launchModel')(sequelize, Sequelize.DataTypes);
db.Simulation = require('./simulationModel')(sequelize, Sequelize.DataTypes);

// Relacionamentos
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;