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
    const { isChecked, amountSaved } = req.body; // Alterado para isChecked

    const progress = await Progress.findByPk(progressId);
    if (!progress) {
      return res.status(404).json({ message: 'Progresso não encontrado' });
    }

    // Atualiza os campos isChecked e amountSaved
    progress.isChecked = isChecked; // Alterado para isChecked
    progress.amountSaved = amountSaved;
    await progress.save();

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};