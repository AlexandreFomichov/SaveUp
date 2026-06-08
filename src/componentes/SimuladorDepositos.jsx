import React, { useState, useCallback } from 'react';
import './SimuladorDepositos.css';

/**
 * Componente de Simulador de Depósitos
 * Simula juros compostos mensais e permite guardar depósitos
 */
function DepositSimulator({ userId, token }) {
  const [simulationData, setSimulationData] = useState({
    valor: '',
    taxa_juros: '2',
    prazo_meses: '12',
  });

  const [simulation, setSimulation] = useState(null);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cálculo de juros compostos
   * Fórmula: A = P(1 + r/12)^n
   * onde P é o capital inicial, r é a taxa anual, e n é o número de meses
   */
  const calculateCompoundInterest = useCallback(() => {
    const principal = parseFloat(simulationData.valor);
    const annualRate = parseFloat(simulationData.taxa_juros);
    const months = parseInt(simulationData.prazo_meses);

    if (!principal || !annualRate || !months) {
      setSimulation(null);
      return;
    }

    if (principal <= 0 || annualRate < 0 || months <= 0) {
      setError('Por favor, introduza valores válidos (capital > 0, taxa >= 0, prazo > 0)');
      setSimulation(null);
      return;
    }

    const monthlyRate = annualRate / 12 / 100; // Taxa mensal em decimal
    const finalAmount = principal * Math.pow(1 + monthlyRate, months);
    const totalInterest = finalAmount - principal;

    // Simular mês a mês para mostrar a evolução
    const monthlyBreakdown = [];
    let currentAmount = principal;

    for (let i = 0; i <= months; i++) {
      monthlyBreakdown.push({
        month: i,
        amount: i === 0 ? principal : currentAmount,
        interest: i === 0 ? 0 : currentAmount - principal,
      });

      if (i < months) {
        currentAmount *= 1 + monthlyRate;
      }
    }

    setSimulation({
      principal,
      annualRate,
      months,
      monthlyRate: monthlyRate * 100,
      finalAmount,
      totalInterest,
      monthlyBreakdown,
    });

    setError(null);
  }, [simulationData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...simulationData, [name]: value };
    setSimulationData(newData);

    // Recalcular automaticamente
    if (name === 'valor' || name === 'taxa_juros' || name === 'prazo_meses') {
      const principal = parseFloat(newData.valor);
      if (principal > 0) {
        setSimulationData(newData);
        // O cálculo será feito no próximo render
      }
    }
  };

  // Calcular quando os inputs mudam
  React.useEffect(() => {
    if (simulationData.valor) {
      calculateCompoundInterest();
    }
  }, [simulationData.valor, simulationData.taxa_juros, simulationData.prazo_meses, calculateCompoundInterest]);

  return (
    <div className="deposit-simulator-container">
      <div className="simulator-header">
        <h2>Simulador de Depósitos</h2>
        <p className="simulator-subtitle">Calcule o rendimento com juros compostos</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="simulator-content">
        {/* Painel de Entrada */}
        <div className="simulator-inputs">
          <h3>Parâmetros do Depósito</h3>

          <div className="form-group">
            <label htmlFor="valor">Capital Inicial (€)</label>
            <input
              type="number"
              id="valor"
              name="valor"
              placeholder="1000.00"
              step="0.01"
              min="0"
              value={simulationData.valor}
              onChange={handleInputChange}
            />
            <small>Quanto quer poupar?</small>
          </div>

          <div className="form-group">
            <label htmlFor="taxa_juros">Taxa de Juro Anual (%)</label>
            <input
              type="number"
              id="taxa_juros"
              name="taxa_juros"
              placeholder="2.5"
              step="0.01"
              min="0"
              value={simulationData.taxa_juros}
              onChange={handleInputChange}
            />
            <small>Taxa anual (ex: 2.5 para 2,5%)</small>
          </div>

          <div className="form-group">
            <label htmlFor="prazo_meses">Prazo (meses)</label>
            <input
              type="number"
              id="prazo_meses"
              name="prazo_meses"
              placeholder="12"
              step="1"
              min="1"
              value={simulationData.prazo_meses}
              onChange={handleInputChange}
            />
            <small>Duração do depósito em meses</small>
          </div>
        </div>

        {/* Resultados */}
        {simulation && (
          <div className="simulator-results">
            <h3>Resultados da Simulação</h3>

            <div className="results-grid">
              <div className="result-card primary">
                <span className="result-label">Montante Final</span>
                <span className="result-value">€{simulation.finalAmount.toFixed(2)}</span>
              </div>

              <div className="result-card">
                <span className="result-label">Capital Inicial</span>
                <span className="result-value">€{simulation.principal.toFixed(2)}</span>
              </div>

              <div className="result-card success">
                <span className="result-label">Juros Ganhos</span>
                <span className="result-value">€{simulation.totalInterest.toFixed(2)}</span>
              </div>

              <div className="result-card">
                <span className="result-label">Taxa Mensal</span>
                <span className="result-value">{simulation.monthlyRate.toFixed(3)}%</span>
              </div>

              <div className="result-card">
                <span className="result-label">Período</span>
                <span className="result-value">{simulation.months} meses</span>
              </div>

              <div className="result-card">
                <span className="result-label">Rendimento Médio/Mês</span>
                <span className="result-value">
                  €{(simulation.totalInterest / simulation.months).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Toggle de Detalhes */}
            <button
              className="btn-toggle-details"
              onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
            >
              {showMonthlyBreakdown ? '▼ Ocultar' : '▶ Ver'} Evolução Mês a Mês
            </button>

            {/* Tabela de Evolução */}
            {showMonthlyBreakdown && (
              <div className="monthly-breakdown">
                <table className="breakdown-table">
                  <thead>
                    <tr>
                      <th>Mês</th>
                      <th>Montante</th>
                      <th>Juros Acumulados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulation.monthlyBreakdown.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'even' : ''}>
                        <td>{row.month === 0 ? 'Início' : `Mês ${row.month}`}</td>
                        <td>€{row.amount.toFixed(2)}</td>
                        <td>€{row.interest.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!simulation && simulationData.valor && (
          <div className="simulator-empty">
            <p>Introduza os valores para simular</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="simulator-info">
        <h4>ℹ️ Como funciona?</h4>
        <p>
          O simulador calcula juros compostos <strong>mensalmente</strong>. Isto significa que cada mês,
          você ganha juros não apenas sobre o capital inicial, mas também sobre os juros já acumulados.
        </p>
        <p>
          <strong>Fórmula:</strong> Montante Final = Capital × (1 + Taxa/12)^Meses
        </p>
      </div>
    </div>
  );
}

export default DepositSimulator;
