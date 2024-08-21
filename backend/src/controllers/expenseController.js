const db = require('../models/index');
const Expense = db.Expense;
const Tag = db.Tag;

exports.createExpense = async (req, res) => {
  try {
    const { description, amount, date, observation, paid, tags } = req.body;

    // Criação da despesa
    const newExpense = await Expense.create({
      description,
      amount,
      date,
      observation,
      paid
    });

    // Lidar com as tags
    if (tags && tags.length > 0) {
      const tagPromises = tags.map(async (tagName) => {
        let tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        return tag;
      });

      const tagResults = await Promise.all(tagPromises);

      // Associa as tags à despesa
      await newExpense.addTags(tagResults);
    }

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: ['tags']  // Inclui as tags associadas a cada despesa
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: ['tags']  // Inclui as tags associadas à despesa
    });
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { description, amount, date, observation, paid, tags } = req.body;

    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Atualiza os dados da despesa
    await expense.update({ description, amount, date, observation, paid });

    // Lidar com as tags (remover associações antigas e criar/associar novas)
    if (tags && tags.length > 0) {
      const tagPromises = tags.map(async (tagName) => {
        let tag = await Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        return tag;
      });

      const tagResults = await Promise.all(tagPromises);

      // Remove as tags antigas e associa as novas
      await expense.setTags(tagResults);
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};