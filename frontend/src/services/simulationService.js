import api from './api';

const SIMULATIONS_API_URL = '/simulations';
const PROGRESS_API_URL = '/progresses';

export const getSimulations = async () => {
  try {
    const response = await api.get(SIMULATIONS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching simulations:', error);
    throw error;
  }
};

export const addSimulation = async (simulation) => {
  try {
    const response = await api.post(SIMULATIONS_API_URL, simulation);
    return response.data;
  } catch (error) {
    console.error('Error adding simulation:', error);
    throw error;
  }
};

export const getSimulationById = async (id) => {
  try {
    const response = await api.get(`${SIMULATIONS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting simulation:', error);
    throw error;
  }
};

export const updateSimulation = async (id, simulation) => {
  try {
    const response = await api.put(`${SIMULATIONS_API_URL}/${id}`, simulation);
    return response.data;
  } catch (error) {
    console.error('Error updating simulation:', error);
    throw error;
  }
};

export const deleteSimulation = async (id) => {
  try {
    await api.delete(`${SIMULATIONS_API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting simulation:', error);
    throw error;
  }
};

export const getProgressBySimulationId = async (simulationId) => {
  try {
    const response = await api.get(`${PROGRESS_API_URL}?simulationId=${simulationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

export const updateProgress = async (progressId, progress) => {
  try {
    const response = await api.put(`${PROGRESS_API_URL}/${progressId}`, progress);
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};