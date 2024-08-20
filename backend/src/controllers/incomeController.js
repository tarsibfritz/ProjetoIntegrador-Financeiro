const db = require('../models/index');
const Income = db.Income;

exports.createIncome = async (req, res) => {
  try {
    const income = await Income.create(req.body);
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll();
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findByPk(req.params.id);
    if (income) {
      res.status(200).json(income);
    } else {
      res.status(404).json({ message: 'Income not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const [updated] = await Income.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedIncome = await Income.findByPk(req.params.id);
      res.status(200).json(updatedIncome);
    } else {
      res.status(404).json({ message: 'Income not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const deleted = await Income.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Income not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};