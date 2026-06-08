/**
 * Configuração da aplicação SaveUp
 * Define constantes e variáveis de ambiente
 */

// Ambiente
export const ENVIRONMENT = import.meta.env.MODE || 'development';

// URL da API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configurações de aplicação
export const CONFIG = {
  // Paginação
  ITEMS_PER_PAGE: 10,

  // Formatação de moeda
  CURRENCY: 'EUR',
  CURRENCY_SYMBOL: '€',

  // Formatação de data
  DATE_FORMAT: 'DD/MM/YYYY',
  DATE_LOCALE: 'pt-PT',

  // Timeouts
  API_TIMEOUT: 10000, // 10 segundos

  // Armazenamento local
  STORAGE_KEYS: {
    TOKEN: 'saveup_token',
    USER: 'saveup_user',
    PREFERENCES: 'saveup_preferences',
  },

  // Temas disponíveis
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
  },

  // Cores
  COLORS: {
    PRIMARY: '#27ae60',
    PRIMARY_DARK: '#1e8449',
    PRIMARY_LIGHT: '#2ecc71',
    SECONDARY: '#f5ede5',
    ACCENT: '#f39c12',
    ERROR: '#e74c3c',
    SUCCESS: '#27ae60',
    WARNING: '#f39c12',
    INFO: '#3498db',
  },
};

// Endpoints da API
export const ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // Utilizadores
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },

  // Despesas
  EXPENSES: {
    LIST: '/despesas',
    CREATE: '/despesas',
    UPDATE: (id) => `/despesas/${id}`,
    DELETE: (id) => `/despesas/${id}`,
    FILTER: '/despesas/filter',
  },

  // Categorias
  CATEGORIES: {
    LIST: '/categorias',
    CREATE: '/categorias',
    UPDATE: (id) => `/categorias/${id}`,
    DELETE: (id) => `/categorias/${id}`,
  },

  // Orçamentos
  BUDGETS: {
    LIST: '/orcamentos',
    CREATE: '/orcamentos',
    UPDATE: (id) => `/orcamentos/${id}`,
    DELETE: (id) => `/orcamentos/${id}`,
    BY_MONTH: '/orcamentos/month',
  },
};
