import api from './api';

const API_URL = '/simulations';

// Listagem de todas as simulações
export const getSimulations = async () => {
   try {
      const response = await api.get(API_URL);
      return response.data;
   } catch (error) {
    console.error('Error fetching simulations:', error);
    throw error;
   }
};

// Criação de uma nova simulação
export const addSimulation = async (simulation) => {
  try {
    const response = await api.post(API_URL, simulation);
    return response.data;
  } catch (error) {
    console.error('Error adding simulation:', error);
    throw error;
  }
};


// Obter uma simulação específica pelo ID
export const getSimulationById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting simulation:', error);
    throw error;
  }
};

// Atualizar uma simulação específica
export const updateSimulation = async (id, updateData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating simulation:', error);
    throw error;
  }
};

// Excluir uma simulação específica
export const deleteSimulation = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting simulation:', error);
    throw error;
  }
};