const db = require('../models/index');
const Progress = db.Progress;

// Listar progresso de uma simulação específica
exports.getProgressBySimulationId = async (req, res) => {
  try {
    const { simulationId } = req.query;
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

    // Convert boolean to integer for MySQL if needed
    progress.isChecked = isChecked ? 1 : 0;
    progress.amountSaved = amountSaved;
    await progress.save();

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Adicione a função addProgress aqui
exports.addProgress = async (req, res) => {
  try {
    const { simulationId, amountSaved } = req.body;
    const progress = await Progress.create({
      simulationId,
      amountSaved,
      isChecked: 0, // Default to false (0)
    });
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};