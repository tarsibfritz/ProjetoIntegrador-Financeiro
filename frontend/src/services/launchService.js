import api from './api';

const API_URL = '/launches';

export const getLaunches = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw error;
  }
};

export const addLaunch = async (launch) => {
  try {
    const response = await api.post(API_URL, launch);
    return response.data;
  } catch (error) {
    console.error('Error adding launch:', error);
    throw error;
  }
};

export const updateLaunch = async (id, launch) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, launch);
    return response.data;
  } catch (error) {
    console.error('Error updating launch:', error);
    throw error;
  }
};

export const deleteLaunch = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting launch:', error);
    throw error;
  }
};