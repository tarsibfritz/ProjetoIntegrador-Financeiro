const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;

// Defina uma chave secreta para assinar os tokens (deve estar em .env)
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

// Autenticar um usuário e gerar um token JWT
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Encontrar o usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Comparar a senha fornecida com a senha armazenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    // Retornar o token junto com o usuário
    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário com a senha criptografada
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Se houver uma nova senha, criptografá-la
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const [updated] = await User.update(
      {
        name,
        email,
        ...(hashedPassword && { password: hashedPassword }), // Se houver senha nova, atualiza
      },
      {
        where: { id: req.params.id }
      }
    );

    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Excluir um usuário
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};