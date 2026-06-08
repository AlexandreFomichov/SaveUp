// Dados mock para testes
export const mockUser = { id: 1, nome: 'João Silva', email: 'joao@example.com' };

export const mockCategories = [
  { id: 1, nome: 'Alimentação' },
  { id: 2, nome: 'Transporte' },
  { id: 3, nome: 'Saúde' },
];

export const mockExpenses = [
  { id: 1, utilizador_id: 1, categoria_id: 1, categoria_nome: 'Alimentação', descricao: 'Supermercado', valor: 45.5, data: '2024-02-08' },
  { id: 2, utilizador_id: 1, categoria_id: 2, categoria_nome: 'Transporte', descricao: 'Bilhete', valor: 2.5, data: '2024-02-09' },
];

export const mockBudget = [{ id: 1, utilizador_id: 1, valor_mensal: 500.0, mes: 2, ano: 2024 }];

export const mockDeposits = [
  { id: 1, utilizador_id: 1, valor: 1000, taxa_juros: 2.5, prazo_meses: 12, data_inicio: '2024-01-01', montante_final: 1025.5 },
];

export const mockIncomeCategories = [
  { id: 1, nome: 'Freelance' },
  { id: 2, nome: 'Bónus' },
  { id: 3, nome: 'Venda' },
];

export const mockIncomesExtra = [
  { id: 1, utilizador_id: 1, categoria_id: 1, categoria_nome: 'Freelance', origem: 'Projeto X', valor: 250.0, data: '2024-02-15' },
];

export const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));
