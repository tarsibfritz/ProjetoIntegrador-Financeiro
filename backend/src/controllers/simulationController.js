const db = require('../models/index');
const Simulation = db.Simulation;
const Progress = db.Progress;

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

    // Crie a simulação
    const newSimulation = await Simulation.create({
      name,
      description,
      totalValue,
      monthlySavings,
      monthsToSave,
      goalAchieved: false,
    });

    // Inicializar o progresso para cada mês
    for (let month = 1; month <= monthsToSave; month++) {
      await Progress.create({
        simulationId: newSimulation.id,
        month,
        isChecked: false,
      });
    }

    res.status(201).json(newSimulation);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Listagem de todas as simulações
exports.getAllSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.findAll({
      include: [{ model: Progress }]
    });
    res.status(200).json(simulations);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Listar simulação específica com progresso
exports.getSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findByPk(req.params.id, {
      include: [{ model: Progress }]
    });
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
    const { savedAmount, progress } = req.body;

    const simulation = await Simulation.findByPk(req.params.id, {
      include: [{ model: Progress }]
    });

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

    // Atualizar o progresso
    if (progress && Array.isArray(progress)) {
      for (const prog of progress) {
        const progRecord = await Progress.findOne({
          where: { id: prog.id, simulationId: simulation.id }
        });
        if (progRecord) {
          progRecord.isChecked = prog.isChecked;
          await progRecord.save();
        }
      }
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
    const simulation = await Simulation.findByPk(req.params.id);

    if (!simulation) {
      return res.status(404).json({ mensagem: 'Simulação não encontrada' });
    }

    await Progress.destroy({ where: { simulationId: simulation.id } });
    await simulation.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Listar progresso de uma simulação específica
exports.getProgressBySimulationId = async (req, res) => {
  try {
    const { simulationId } = req.query;
    const progress = await Progress.findAll({
      where: { simulationId }
    });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Atualização de progresso de uma simulação específica
exports.updateProgress = async (req, res) => {
  try {
    const progressId = req.params.id;
    const { isChecked } = req.body;

    const progress = await Progress.findByPk(progressId);
    if (!progress) {
      return res.status(404).json({ mensagem: 'Progresso não encontrado' });
    }

    progress.isChecked = isChecked;
    await progress.save();

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
