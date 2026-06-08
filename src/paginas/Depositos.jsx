import React, { useCallback } from 'react';
import DepositSimulator from '../componentes/SimuladorDepositos';
import useDataSync from '../ganchos/useSincronizacaoDados';
import '../paginas/Paginas.css';

function DepositsPage({ userId, token }) {
  const { notifyUpdate } = useDataSync('deposits', () => {});

  const handleDepositSaved = useCallback(() => {
    notifyUpdate();
  }, [notifyUpdate]);

  return (
    <div className="page-container">
      <h2 className="page-title">Depósitos</h2>
      <div className="page-single">
        <DepositSimulator userId={userId} token={token} onDepositSaved={handleDepositSaved} />
      </div>
    </div>
  );
}

export default DepositsPage;
