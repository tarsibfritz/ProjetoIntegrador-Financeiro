const db = require('../models/index');
const Simulation = db.Simulation;

// Criação de uma nova simulação
exports.createSimulation = async (req, res) => {
  try {
    const { name, description, totalValue, monthlySavings } = req.body;

    const total = parseFloat(totalValue);
    const savings = parseFloat(monthlySavings);

    if (isNaN(total) || isNaN(savings) || savings <= 0) {
      throw new Error('Valor total e valor mensal devem ser números válidos e o valor mensal deve ser maior que zero.');
    }

    const monthsToSave = total <= 0 ? 0 : Math.ceil(total / savings);

    const newSimulation = await Simulation.create({
      name,
      description,
      totalValue,
      monthlySavings,
      monthsToSave,
      savedAmount: 0,
      goalAchieved: false,
    });

    res.status(201).json(newSimulation);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};


// Listagem de todas as simulações
exports.getAllSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.findAll();
    res.status(200).json(simulations);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Listar simulação específica
exports.getSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findByPk(req.params.id);
    if (simulation) {
      res.status(200).json(simulation);
    } else {
      res.status(404).json({ mensagem: 'Simulação não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Atualização de uma simulação específica (atualização do progresso)
exports.updateSimulation = async (req, res) => {
  try {
    const { savedAmount } = req.body;

    const simulation = await Simulation.findByPk(req.params.id);

    if (!simulation) {
      return res.status(404).json({ mensagem: 'Simulação não encontrada' });
    }

    // Atualizar o valor economizado e verificar se a meta foi alcançada
    simulation.savedAmount = savedAmount;
    simulation.goalAchieved = savedAmount >= simulation.totalValue;

    // Recalcular o tempo necessário para atingir a meta com base no monthlySavings
    if (simulation.monthlySavings > 0) {
      const monthsRequired = Math.ceil((simulation.totalValue - simulation.savedAmount) / simulation.monthlySavings);
      simulation.monthsToSave = monthsRequired;
    }

    await simulation.save();

    res.status(200).json(simulation);
  } catch (error) {
    console.error('Erro ao atualizar simulação:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

// Excluir uma simulação específica
exports.deleteSimulation = async (req, res) => {
  try {
    const deleted = await Simulation.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Simulação não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};