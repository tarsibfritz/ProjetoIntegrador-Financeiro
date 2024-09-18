const db = require('../models/index');
const Progress = db.Progress;

// Listar progresso de uma simulação específica
exports.getProgressBySimulationId = async (req, res) => {
  try {
    const { simulationId } = req.query;
    if (!simulationId) {
      return res.status(400).json({ message: 'simulationId é necessário' });
    }
    
    const progress = await Progress.findAll({
      where: { simulationId },
    });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualização de progresso de uma simulação específica
exports.updateProgress = async (req, res) => {
  try {
    const progressId = req.params.id;
    const { isChecked, amountSaved } = req.body;

    const progress = await Progress.findByPk(progressId);
    if (!progress) {
      return res.status(404).json({ message: 'Progresso não encontrado' });
    }

    // Atualiza os campos conforme o modelo
    progress.isChecked = Boolean(isChecked);
    progress.amountSaved = amountSaved;
    await progress.save();

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Adicionar progresso
exports.addProgress = async (req, res) => {
  try {
    const { simulationId, month, amountSaved } = req.body;
    if (month == null || simulationId == null) {
      return res.status(400).json({ message: 'simulationId e month são necessários' });
    }
    
    const progress = await Progress.create({
      simulationId,
      month,
      amountSaved,
      isChecked: false, // Default para false
    });
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};