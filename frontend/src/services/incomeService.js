import api from './api';

const API_URL = '/incomes';

export const fetchIncomes = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching incomes:', error);
    throw error;
  }
};

export const addIncome = async (income) => {
  try {
    const response = await api.post(API_URL, income);
    return response.data;
  } catch (error) {
    console.error('Error adding income:', error);
    throw error;
  }
};

export const updateIncome = async (id, income) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, income);
    return response.data;
  } catch (error) {
    console.error('Error updating income:', error);
    throw error;
  }
};

export const deleteIncome = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting income:', error);
    throw error;
  }
};