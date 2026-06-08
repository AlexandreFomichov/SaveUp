/**
 * Serviço de API para a aplicação SaveUp
 * Define todas as chamadas HTTP para comunicar com o backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('🔌 API Service Initialized:');
console.log('  - API_BASE_URL:', API_BASE_URL);
console.log('  - VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA);
console.log('  - USE_MOCK (calculated):', import.meta.env.VITE_USE_MOCK_DATA === 'true');

/**
 * Configuração comum para requisições
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Função auxiliar para gerir erros (sincrona)
 * Mantemos simples: logamos e re-lançamos o erro para que os callers
 * possam capturá-lo corretamente (evita usar async aqui).
 */
const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

// Modo mock controlado por variável de ambiente VITE_USE_MOCK_DATA
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';
import { mockExpenses, mockCategories, mockBudget, mockIncomeCategories, mockIncomesExtra, delay } from './dadosMock';


/**
 * ==================== AUTENTICAÇÃO ====================
 */
export let authService = {
  login: async (email, password) => {
    try {
      console.log('🔐 authService.login chamado - usando API real (não mock)');
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao fazer login');
      }
      
      const jsonResponse = await response.json();
      console.log('✅ API retornou:', jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  register: async (nome, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ nome, email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao registar');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  },
};

/**
 * ==================== DESPESAS ====================
 */
export let expensesService = {
  getAll: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/despesas/${userId}`, {
        method: 'GET',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao obter despesas');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  getByDateRange: async (userId, startDate, endDate, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/despesas/${userId}?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            ...defaultHeaders,
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Falha ao obter despesas');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  getByCategory: async (userId, categoryId, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/despesas/${userId}?categoriaId=${categoryId}`,
        {
          method: 'GET',
          headers: {
            ...defaultHeaders,
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Falha ao obter despesas');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  create: async (userId, expense, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/despesas`, {
        method: 'POST',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...expense, utilizador_id: userId }),
      });
      if (!response.ok) throw new Error('Falha ao criar despesa');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  update: async (expenseId, expense, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/despesas/${expenseId}`, {
        method: 'PUT',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error('Falha ao atualizar despesa');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (expenseId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/despesas/${expenseId}`, {
        method: 'DELETE',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao eliminar despesa');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
};

/**
 * ==================== CATEGORIAS ====================
 */
export let categoriesService = {
  getAll: async (token) => {
    try {
      console.log('📡 categoriesService.getAll - Requisição ao backend');
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'GET',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao obter categorias');
      const data = await response.json();
      console.log('✅ Categorias retornadas:', data);
      return data;
    } catch (error) {
      console.error('❌ erro em categoriesService.getAll:', error);
      return [];
    }
  },

  create: async (category, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error('Falha ao criar categoria');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
};

/**
 * ==================== CATEGORIAS RENDIMENTOS ====================
 */
export let incomeCategoriesService = {
  getAll: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias_rendimentos`, {
        method: 'GET',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao obter categorias de rendimentos');
      return await response.json();
    } catch (error) {
      console.error('Erro em incomeCategoriesService.getAll:', error);
      return [];
    }
  },
  create: async (category, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias_rendimentos`, {
        method: 'POST',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error('Falha ao criar categoria de rendimento');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
};

/**
 * ==================== ORÇAMENTOS ====================
 */
export let budgetService = {
  getByMonth: async (userId, month, year, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orcamentos/${userId}?mes=${month}&ano=${year}`,
        {
          method: 'GET',
          headers: {
            ...defaultHeaders,
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Falha ao obter orçamento');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  create: async (userId, budget, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orcamentos`, {
        method: 'POST',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...budget, utilizador_id: userId }),
      });
      if (!response.ok) throw new Error('Falha ao criar orçamento');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  update: async (budgetId, budget, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orcamentos/${budgetId}`, {
        method: 'PUT',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(budget),
      });
      if (!response.ok) throw new Error('Falha ao atualizar orçamento');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
};

/**
 * ==================== RECEITAS ====================
 */
export let incomesService = {
  getAll: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rendimentos_extra/${userId}`, {
        method: 'GET',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao obter receitas');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  getByDateRange: async (userId, startDate, endDate, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/rendimentos_extra/${userId}?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            ...defaultHeaders,
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Falha ao obter receitas');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  create: async (userId, income, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rendimentos_extra`, {
        method: 'POST',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...income, utilizador_id: userId }),
      });
      if (!response.ok) throw new Error('Falha ao criar rendimento');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  update: async (incomeId, income, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rendimentos_extra/${incomeId}`, {
        method: 'PUT',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(income),
      });
      if (!response.ok) throw new Error('Falha ao atualizar rendimento');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (incomeId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rendimentos_extra/${incomeId}`, {
        method: 'DELETE',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao eliminar rendimento');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
};
 
// MODO MOCK DESABILITADO - APENAS API REAL SERÁ USADO
// Se estivermos em modo mock, sobrescreve as implementações com dados locais
/*
if (USE_MOCK) {
  authService = {
    login: async (email, password) => {
      await delay();
      return { token: 'mock-token', user: { id: 1, nome: 'João' } };
    },
    register: async (nome, email, password) => {
      await delay();
      return { id: 1, nome, email, data_criacao: new Date().toISOString() };
    },
  };

  expensesService = {
    getAll: async () => { await delay(); return mockExpenses; },
    getByDateRange: async () => { await delay(); return mockExpenses; },
    getByCategory: async (userId, categoryId) => { await delay(); return mockExpenses.filter(e => e.categoria_id === Number(categoryId)); },
    create: async (userId, expense) => { await delay(); return { id: Date.now(), ...expense, utilizador_id: userId }; },
    update: async () => { await delay(); return { success: true }; },
    delete: async () => { await delay(); return { success: true }; },
  };

  categoriesService = {
    getAll: async () => { await delay(); return mockCategories; },
    create: async (category) => { await delay(); return { id: Date.now(), ...category }; },
  };

  budgetService = {
    getByMonth: async () => { await delay(); return mockBudget; },
    create: async () => { await delay(); return mockBudget[0]; },
    update: async () => { await delay(); return { success: true }; },
  };

}
*/
