import axios from 'axios';

// Crie uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicione interceptador de requisição
api.interceptors.request.use(
  (config) => {
    // Obtenha o token do localStorage
    const token = localStorage.getItem('token');
    
    // Adicione o token ao cabeçalho Authorization, se disponível
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Trate erros de requisição
    return Promise.reject(error);
  }
);

// Adicione interceptador de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;