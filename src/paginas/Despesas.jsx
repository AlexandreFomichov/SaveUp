import React, { useCallback } from 'react';
import ExpenseForm from '../componentes/FormularioDespesa';
import ExpenseList from '../componentes/ListaDespesas';
import useDataSync from '../ganchos/useSincronizacaoDados';
import '../paginas/Paginas.css';
import './Despesas.css';

function ExpensesPage({ userId, token, refreshTrigger, onExpenseCreated }) {
  const { notifyUpdate } = useDataSync('expenses', () => {});

  const handleExpenseCreated = useCallback(() => {
    if (onExpenseCreated) {
      onExpenseCreated();
    }
    notifyUpdate();
  }, [onExpenseCreated, notifyUpdate]);

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div className="expenses-intro">
          <h1>Despesas</h1>
          <p>Acompanhe e controle todas as suas despesas</p>
        </div>
      </div>

      <div className="expenses-layout">
        <div className="expenses-form-section">
          <ExpenseForm userId={userId} token={token} onExpenseCreated={handleExpenseCreated} />
        </div>
        
        <div className="expenses-list-section">
          <ExpenseList userId={userId} token={token} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}

export default ExpensesPage;
