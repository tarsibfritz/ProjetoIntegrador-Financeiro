import api from './api';

const PROGRESS_API_URL = '/progresses';

// Função para obter o progresso por ID de simulação
export const getProgressBySimulationId = async (simulationId) => {
  try {
    const response = await api.get(`${PROGRESS_API_URL}?simulationId=${simulationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

// Função para atualizar o progresso
export const updateProgress = async (id, data) => {
  try {
    const response = await api.put(`${PROGRESS_API_URL}/${id}`, data); // Certifique-se de que o método e a URL estão corretos
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error.response?.data || error.message);
    throw error;
  }
};