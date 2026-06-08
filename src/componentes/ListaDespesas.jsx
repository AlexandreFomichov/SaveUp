import React, { useState, useEffect, useCallback } from 'react';
import { expensesService } from '../servicos/api';
import { formatCurrency, formatDate } from '../utilitarios/formatadores';
import './ListaDespesas.css';

/**
 * Componente de Lista de Despesas
 * Exibe apenas as despesas recentes
 */
function ExpenseList({ userId, token, refreshTrigger }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregamento de despesas
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expensesService.getAll(userId, token);
      setExpenses(data || []);
    } catch (err) {
      console.error(err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (userId && token) {
      loadExpenses();
    }
  }, [userId, token, refreshTrigger, loadExpenses]);


  // Função para eliminar despesa
  const deleteExpense = async (expenseId) => {
    if (window.confirm('Tem a certeza que deseja eliminar esta despesa?')) {
      try {
        setError(null);
        await expensesService.delete(expenseId, token);
        await loadExpenses();
      } catch (err) {
        setError('Erro ao eliminar despesa');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="expense-list-container"><p>Carregando despesas...</p></div>;
  }

  return (
    <div className="expense-list-container">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="expense-list-header">
        <div>
          <h2>Despesas recentes</h2>
          <p>Veja os lançamentos mais recentes e mantenha o controlo.</p>
        </div>
      </div>

      <div className="transactions-wrapper">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma despesa registada.</p>
          </div>
        ) : (
          <ul className="transactions-list">
            {expenses.map((expense) => (
              <li key={expense.id || expense._id} className="transaction-item expense">
                <div className="trans-left">
                  <div className="trans-icon">€</div>
                  <div className="trans-info">
                    <span className="trans-category">
                      {expense.categoria_nome || expense.categoria || 'Outras'}
                    </span>
                    <span className="trans-desc">
                      {expense.descricao || 'Sem descrição'}
                    </span>
                  </div>
                </div>
                <div className="trans-right">
                  <div className="trans-value-date">
                    <span className="trans-value">-{formatCurrency(parseFloat(expense.valor) || 0)}</span>
                    <span className="trans-date">{formatDate(expense.data)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
