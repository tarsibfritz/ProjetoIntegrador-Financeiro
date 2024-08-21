import api from './api';

const API_URL = '/tags';

export const getTags = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const addTag = async (tag) => {
  try {
    const response = await api.post(API_URL, tag);
    return response.data;
  } catch (error) {
    console.error('Error adding tag:', error);
    throw error;
  }
};

export const updateTag = async (id, tag) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, tag);
    return response.data;
  } catch (error) {
    console.error('Error updating tag:', error);
    throw error;
  }
};

export const deleteTag = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
};