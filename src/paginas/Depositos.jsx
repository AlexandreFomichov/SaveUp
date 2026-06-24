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
      <div className="section-title">
        <div>
          <h2>Depósitos</h2>
          <p className="page-description">Simule depósitos a prazo e veja o rendimento ao longo do tempo com um layout claro e consistente.</p>
        </div>
      </div>
      <div className="page-single">
        <DepositSimulator userId={userId} token={token} onDepositSaved={handleDepositSaved} />
      </div>
    </div>
  );
}

export default DepositsPage;
