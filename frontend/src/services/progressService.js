import api from './api';

const PROGRESS_API_URL = '/progresses';

// Função para obter o progresso por ID de simulação
export const getProgressBySimulationId = async (simulationId) => {
  if (!simulationId) {
    throw new Error('simulationId é necessário');
  }
  try {
    const response = await api.get(`${PROGRESS_API_URL}?simulationId=${simulationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress:', error.response?.data || error.message);
    throw error;
  }
};

// Função para atualizar o progresso
export const updateProgress = async (id, data) => {
  if (!id || !data) {
    throw new Error('ID e dados são necessários para atualizar o progresso');
  }
  try {
    const response = await api.put(`${PROGRESS_API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error.response?.data || error.message);
    throw error;
  }
};

// Função para criar um novo registro de progresso
export const createProgress = async (data) => {
  const { simulationId, month, amountSaved } = data;
  if (simulationId == null || month == null || amountSaved == null) {
    throw new Error('simulationId, month e amountSaved são necessários para criar o progresso');
  }
  try {
    const response = await api.post(PROGRESS_API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar progresso:', error.response?.data || error.message);
    throw error;
  }
};