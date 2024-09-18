const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Carregar variáveis de ambiente

// Inicialização do Express
const app = express();
const port = process.env.PORT || 3000;

// Importar as rotas
const userRoutes = require('./routes/userRoutes');
const launchRoutes = require('./routes/launchRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const progressRoutes = require('./routes/progressRoutes');

// Middleware
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json()); // Analisar o corpo das requisições como JSON

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/launches', launchRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/progresses', progressRoutes);

// Conectar ao banco de dados e sincronizar modelos
const db = require('./models/index');

// Testar a conexão com o banco de dados
db.sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // Sincronizar os modelos com o banco de dados
    db.sequelize.sync() // Para sincronização básica
    // db.sequelize.sync({ force: true }) // Para sincronização com força (exclui e recria tabelas)
      .then(() => {
        console.log('Models synchronized with the database.');
        // Iniciar o servidor
        if (require.main === module) {
          app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
          });
        }
      })
      .catch((error) => {
        console.error('Error synchronizing models:', error);
      });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = app;