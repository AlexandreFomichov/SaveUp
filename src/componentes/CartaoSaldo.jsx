import React from 'react';
import './CartaoSaldo.css';

export default function BalanceCard({ saldo, disponivel, gastos }) {
  return (
    <div className="balance-card card">
      <div className="balance-top">
        <div className="balance-main">
          <p className="label">Saldo</p>
          <p className="value">€{saldo}</p>
        </div>
        <div className="mini-stats">
          <div className="mini">
            <p className="label-sm">Disponível</p>
            <p className="value-sm">€{disponivel}</p>
          </div>
          <div className="mini">
            <p className="label-sm">Gastos</p>
            <p className="value-sm spent">€{gastos}</p>
          </div>
        </div>
      </div>
    </div>
  );
}