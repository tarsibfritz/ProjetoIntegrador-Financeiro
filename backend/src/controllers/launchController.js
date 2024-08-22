const db = require('../models/index');
const Launch = db.Launch;

exports.createLaunch = async (req, res) => {
  try {
    const { description, amount, date, observation, paid, tag, type } = req.body;

    const newLaunch = await Launch.create({
      description,
      amount,
      date,
      observation,
      paid,
      tag,
      type  // 'expense' ou 'income'
    });

    res.status(201).json(newLaunch);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

exports.getAllLaunches = async (req, res) => {
  try {
    const launches = await Launch.findAll();
    res.status(200).json(launches);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.getLaunchById = async (req, res) => {
  try {
    const launch = await Launch.findByPk(req.params.id);
    if (launch) {
      res.status(200).json(launch);
    } else {
      res.status(404).json({ mensagem: 'Lançamento não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.updateLaunch = async (req, res) => {
  try {
    const { description, amount, date, observation, paid, tag, type } = req.body;

    const launch = await Launch.findByPk(req.params.id);

    if (!launch) {
      return res.status(404).json({ mensagem: 'Lançamento não encontrado' });
    }

    await launch.update({ description, amount, date, observation, paid, tag, type });

    res.status(200).json(launch);
  } catch (error) {
    console.error('Erro ao atualizar lançamento:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

exports.deleteLaunch = async (req, res) => {
  try {
    const deleted = await Launch.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Lançamento não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};