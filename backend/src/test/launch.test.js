const request = require('supertest');
const chai = require('chai');
const app = require('../server');
const db = require('../models/index');

const { expect } = chai;

describe('Launch API Tests', function() {
  this.timeout(15000);

  // Sincronização do banco de dados e limpeza da tabela
  before(async () => {
    await db.sequelize.sync({ force: true });
    await db.Launch.destroy({ where: {}, truncate: true });
  });

  // Teste para criar um novo lançamento
  it('should create a new launch', async () => {
    const newLaunch = {
      description: 'Teste de Lançamento',
      amount: 100.50,
      date: '2023-09-18',
      observation: 'Nenhuma',
      paid: false,
      tag: 'Alimentação',
      type: 'expense'
    };

    const res = await request(app)
      .post('/api/launches')
      .send(newLaunch);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.description).to.equal(newLaunch.description);
  });

  // Teste para listar todos os lançamentos
  it('should get all launches', async () => {
    const res = await request(app)
      .get('/api/launches');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  // Teste para obter um lançamento por ID
  it('should get a launch by id', async () => {
    const launch = await db.Launch.create({
      description: 'Launch for ID test',
      amount: 250.00,
      date: '2023-09-18',
      observation: 'Teste de ID',
      paid: true,
      tag: 'Freelance',
      type: 'income'
    });

    const res = await request(app)
      .get(`/api/launches/${launch.id}`);

    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(launch.id);
  });

  // Teste para atualizar um lançamento
  it('should update a launch', async () => {
    const launch = await db.Launch.create({
      description: 'Launch to be updated',
      amount: 150.00,
      date: '2023-09-18',
      observation: 'Será atualizado',
      paid: false,
      tag: 'Lazer',
      type: 'expense'
    });

    const updatedData = {
      description: 'Launch atualizado',
      amount: 200.00,
      date: '2023-09-19',
      observation: 'Atualizado com sucesso',
      paid: true,
      tag: 'Outros',
      type: 'income'
    };

    const res = await request(app)
      .put(`/api/launches/${launch.id}`)
      .send(updatedData);

    expect(res.status).to.equal(200);
    expect(res.body.description).to.equal(updatedData.description);
  });

  // Teste para deletar um lançamento
  it('should delete a launch', async () => {
    const launch = await db.Launch.create({
      description: 'Launch to be deleted',
      amount: 50.00,
      date: '2023-09-18',
      observation: 'Será deletado',
      paid: false,
      tag: 'Saúde',
      type: 'expense'
    });

    const res = await request(app)
      .delete(`/api/launches/${launch.id}`);

    expect(res.status).to.equal(204);
  });
});
