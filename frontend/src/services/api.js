// src/services/api.js
import axios from 'axios';

// Crie uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // URL base para todas as requisições
  timeout: 10000, // Tempo máximo de espera para a requisição
  headers: {
    'Content-Type': 'application/json', // Tipo de conteúdo padrão
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
    // Manipule a resposta antes de retornar para o componente
    return response;
  },
  (error) => {
    // Trate erros de resposta, incluindo erros de autenticação
    if (error.response && error.response.status === 401) {
      // Por exemplo, você pode redirecionar para a página de login se o token for inválido
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;