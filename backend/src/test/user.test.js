const request = require('supertest');
const chai = require('chai');
const app = require('../server');
const db = require('../models/index');
const bcrypt = require('bcrypt');

const { expect } = chai;

let token;

describe('User API Tests', function() {
  this.timeout(10000);

  before(async function() {
    // Sincronização do banco de dados e limpeza da tabela
    await db.sequelize.sync({ force: true });
    await db.User.destroy({ where: {}, truncate: true });

    const user = await db.User.create({
      name: 'Usuário de Teste',
      email: 'usuarioautenticar@test.com',
      password: await bcrypt.hash('senha123', 10)
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: user.email, password: 'senha123' });

    token = res.body.token;
  });

  it('should create a new user', async () => {
    const newUser = {
      name: 'Usuário Teste',
      email: 'usuario@test.com',
      password: 'senha123'
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal(newUser.name);
    expect(res.body.email).to.equal(newUser.email);
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf.at.least(1);
  });

  it('should get a user by id', async () => {
    const newUser = await db.User.create({
      name: 'Usuário ID Teste',
      email: 'idteste@test.com',
      password: await bcrypt.hash('senha123', 10)
    });

    const res = await request(app)
      .get(`/api/users/${newUser.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(newUser.id);
    expect(res.body.name).to.equal(newUser.name);
    expect(res.body.email).to.equal(newUser.email);
  });

  it('should reset a user password', async () => {
    const user = await db.User.create({
      name: 'Usuário Redefinir Senha',
      email: 'redefinir@test.com',
      password: await bcrypt.hash('senha123', 10)
    });

    const newPassword = 'novaSenha123';
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({ email: user.email, newPassword });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Password updated successfully');
    
    // Verificar se a senha foi atualizada
    const updatedUser = await db.User.findOne({ where: { email: user.email } });
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
    expect(isMatch).to.be.true;
  });

  it('should authenticate a user and return a token', async () => {
    const user = await db.User.create({
      name: 'Usuário Autenticar',
      email: 'autenticar@test.com',
      password: await bcrypt.hash('senha123', 10)
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: user.email, password: 'senha123' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body.user).to.have.property('id');
    expect(res.body.user.name).to.equal(user.name);
    expect(res.body.user.email).to.equal(user.email);
  });

  it('should delete a user', async () => {
    const user = await db.User.create({
      name: 'Usuário Deletar',
      email: 'deletar@test.com',
      password: await bcrypt.hash('senha123', 10)
    });

    const res = await request(app)
      .delete(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(204);
  });
});