/**
 * Serviço de API para a aplicação SaveUp
 * Define todas as chamadas HTTP para comunicar com o backend
 */

import { fetchWithAuth } from './http';

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:3000/api');

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';
import { mockExpenses, mockCategories, mockBudget, mockIncomeCategories, mockIncomesExtra, delay } from './dadosMock';


/**
 * ==================== AUTENTICAÇÃO ====================
 */
export let authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Falha ao fazer login');
    }
    return data;
  },

  register: async (nome, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ nome, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Falha ao registar');
    }
    return data;
  },
};

/**
 * ==================== DESPESAS ====================
 */
export let expensesService = {
  getAll: async (userId, token) => {
    return fetchWithAuth(`/despesas/${userId}`, { method: 'GET' }, token);
  },

  getByDateRange: async (userId, startDate, endDate, token) => {
    return fetchWithAuth(
      `/despesas/${userId}?startDate=${startDate}&endDate=${endDate}`,
      { method: 'GET' },
      token
    );
  },

  getByCategory: async (userId, categoryId, token) => {
    return fetchWithAuth(
      `/despesas/${userId}?categoriaId=${categoryId}`,
      { method: 'GET' },
      token
    );
  },

  create: async (userId, expense, token) => {
    return fetchWithAuth(
      '/despesas',
      {
        method: 'POST',
        body: JSON.stringify({ ...expense, utilizador_id: userId }),
      },
      token
    );
  },

  update: async (expenseId, expense, token) => {
    return fetchWithAuth(
      `/despesas/${expenseId}`,
      {
        method: 'PUT',
        body: JSON.stringify(expense),
      },
      token
    );
  },

  delete: async (expenseId, token) => {
    return fetchWithAuth(`/despesas/${expenseId}`, { method: 'DELETE' }, token);
  },
};

/**
 * ==================== CATEGORIAS ====================
 */
export let categoriesService = {
  getAll: async (token) => {
    try {
      console.log('→ categoriesService.getAll - Requisição ao backend');
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'GET',
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao obter categorias');
      const data = await response.json();
      console.log('✔ Categorias retornadas:', data);
      return data;
    } catch (error) {
      console.error('✖ erro em categoriesService.getAll:', error);
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
