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
      <h2 className="page-title">Orçamento</h2>
      <div className="page-single">
        <BudgetPanel userId={userId} token={token} onBudgetUpdated={handleBudgetUpdated} />
      </div>
    </div>
  );
}

export default BudgetPage;
