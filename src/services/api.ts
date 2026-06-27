import axios from 'axios';
import type { ProblemDetail } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data as ProblemDetail);
    }

    return Promise.reject({
      status: 0,
      title: 'Erro de conexão',
      detail: error.message ?? 'Não foi possível conectar ao servidor.',
    } satisfies ProblemDetail);
  },
);

export default api;
