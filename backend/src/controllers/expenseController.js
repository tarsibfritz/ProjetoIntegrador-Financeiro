const db = require('../models/index');
const Expense = db.Expense;

exports.createExpense = async (req, res) => {
  try {
    const { description, amount, date, observation, paid, tag } = req.body;

    // Criação da despesa
    const newExpense = await Expense.create({
      description,
      amount,
      date,
      observation,
      paid,
      tag
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ mensagem: 'Despesa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { description, amount, date, observation, paid, tag } = req.body;

    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ mensagem: 'Despesa não encontrada' });
    }

    // Atualiza os dados da despesa
    await expense.update({ description, amount, date, observation, paid, tag });

    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Despesa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};