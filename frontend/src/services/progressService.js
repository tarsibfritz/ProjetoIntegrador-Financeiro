import api from './api';

const PROGRESS_API_URL = '/progresses';

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