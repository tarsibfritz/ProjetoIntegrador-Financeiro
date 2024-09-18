const request = require('supertest');
const chai = require('chai');
const app = require('../server');
const db = require('../models/index');

const { expect } = chai;

describe('Simulation API Tests', function() {
  this.timeout(10000);

  // Sincronização do banco de dados
  before(async function() {
    await db.sequelize.sync({ force: true });
  });

  // Teste para criar uma nova simulação
  it('should create a new simulation', async () => {
    const totalValue = 1000;
    const monthlySavings = 200;
    const monthsToSave = Math.ceil(totalValue / monthlySavings);

    const newSimulation = {
      name: 'Simulação Teste',
      totalValue: totalValue,
      monthlySavings: monthlySavings,
      monthsToSave: monthsToSave // Inclua monthsToSave já calculado
    };

    const res = await request(app)
      .post('/api/simulations')
      .send(newSimulation);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal(newSimulation.name);
    expect(res.body.totalValue).to.equal(newSimulation.totalValue);
    expect(res.body.monthsToSave).to.equal(newSimulation.monthsToSave);
  });

  // Teste para listar todas as simulações
  it('should get all simulations', async () => {
    await db.Simulation.create({
      name: 'Simulação de Listagem',
      totalValue: 800,
      monthlySavings: 100,
      monthsToSave: Math.ceil(800 / 100) // Inclua monthsToSave já calculado
    });

    const res = await request(app)
      .get('/api/simulations');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf.at.least(1);
  });

  // Teste para obter uma simulação por ID
  it('should get a simulation by id', async () => {
    const totalValue = 1500;
    const monthlySavings = 300;
    const monthsToSave = Math.ceil(totalValue / monthlySavings);

    const simulation = await db.Simulation.create({
      name: 'Simulação ID Teste',
      totalValue: totalValue,
      monthlySavings: monthlySavings,
      monthsToSave: monthsToSave // Inclua monthsToSave já calculado
    });

    const res = await request(app)
      .get(`/api/simulations/${simulation.id}`);

    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(simulation.id);
    expect(res.body.name).to.equal(simulation.name);
    expect(res.body.totalValue).to.equal(simulation.totalValue);
    expect(res.body.monthsToSave).to.equal(simulation.monthsToSave);
  });

  // Teste para deletar uma simulação
  it('should delete a simulation', async () => {
    const simulation = await db.Simulation.create({
      name: 'Simulação Deletar',
      totalValue: 200,
      monthlySavings: 50,
      monthsToSave: Math.ceil(200 / 50) // Inclua monthsToSave já calculado
    });

    const res = await request(app)
      .delete(`/api/simulations/${simulation.id}`);

    expect(res.status).to.equal(204);
  });
});