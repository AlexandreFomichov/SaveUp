import React, { useCallback } from 'react';
import BudgetPanel from '../componentes/PainelOrcamento';
import useDataSync from '../ganchos/useSincronizacaoDados';
import '../paginas/Paginas.css';

function BudgetPage({ userId, token }) {
  const { notifyUpdate } = useDataSync('budget', () => {});

  const handleBudgetUpdated = useCallback(() => {
    notifyUpdate();
  }, [notifyUpdate]);

  return (
    <div className="page-container">
      <div className="section-title">
        <div>
          <h2>Orçamento</h2>
          <p className="page-description">Gerencie o seu orçamento mensal com clareza e acompanhe os gastos em tempo real.</p>
        </div>
      </div>
      <div className="page-single">
        <BudgetPanel userId={userId} token={token} onBudgetUpdated={handleBudgetUpdated} />
      </div>
    </div>
  );
}

export default BudgetPage;
