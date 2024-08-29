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
      totalValue: total,
      monthlySavings: savings,
      monthsToSave,
    });

    // Inicializar o progresso para cada mês
    const progressData = [];
    for (let month = 1; month <= monthsToSave; month++) {
      progressData.push({
        simulationId: newSimulation.id,
        month,
        isChecked: false,
      });
    }

    await Progress.bulkCreate(progressData);

    res.status(201).json(newSimulation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listagem de todas as simulações
exports.getAllSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.findAll({
      include: [{ model: Progress }],
    });
    res.status(200).json(simulations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar simulação específica com progresso
exports.getSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findByPk(req.params.id, {
      include: [{ model: Progress }],
    });
    if (simulation) {
      res.status(200).json(simulation);
    } else {
      res.status(404).json({ message: 'Simulação não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualização de uma simulação específica
exports.updateSimulation = async (req, res) => {
  try {
    const { progress } = req.body;

    const simulation = await Simulation.findByPk(req.params.id, {
      include: [{ model: Progress }],
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulação não encontrada' });
    }

    // Recalcular o tempo necessário para atingir a meta com base no monthlySavings
    const monthsRequired = Math.ceil((simulation.totalValue - simulation.monthlySavings) / simulation.monthlySavings);
    simulation.monthsToSave = Math.max(monthsRequired, 0);

    // Atualizar o progresso
    if (progress && Array.isArray(progress)) {
      await Promise.all(progress.map(async (prog) => {
        const progRecord = await Progress.findOne({
          where: { id: prog.id, simulationId: simulation.id },
        });
        if (progRecord) {
          progRecord.isChecked = prog.isChecked;
          await progRecord.save();
        }
      }));
    }

    await simulation.save();

    res.status(200).json(simulation);
  } catch (error) {
    console.error('Erro ao atualizar simulação:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Excluir uma simulação específica
exports.deleteSimulation = async (req, res) => {
  try {
    const simulation = await Simulation.findByPk(req.params.id);

    if (!simulation) {
      return res.status(404).json({ message: 'Simulação não encontrada' });
    }

    await Progress.destroy({ where: { simulationId: simulation.id } });
    await simulation.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};