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

// Definindo modelos
db.User = require('./userModel')(sequelize, Sequelize.DataTypes);
db.Launch = require('./launchModel')(sequelize, Sequelize.DataTypes);
db.Simulation = require('./simulationModel')(sequelize, Sequelize.DataTypes);
db.Progress = require('./progressModel')(sequelize, Sequelize.DataTypes);

// Definindo associações
db.Simulation.hasMany(db.Progress, { foreignKey: 'simulationId' });
db.Progress.belongsTo(db.Simulation, { foreignKey: 'simulationId' });

module.exports = db;