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

// Adicione interceptadores se necessário
api.interceptors.request.use(
  (config) => {
    // Adicione headers ou outras configurações antes da requisição ser enviada
    return config;
  },
  (error) => {
    // Trate erros de requisição
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Manipule a resposta antes de retornar para o componente
    return response;
  },
  (error) => {
    // Trate erros de resposta
    return Promise.reject(error);
  }
);

export default api;