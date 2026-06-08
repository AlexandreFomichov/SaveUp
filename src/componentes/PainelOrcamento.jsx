import React, { useState, useEffect } from 'react';
import { budgetService, expensesService } from '../servicos/api';
import { formatCurrency, formatMonthYear } from '../utilitarios/formatadores';
import ProgressBar from './BarraProgresso';
import './PainelOrcamento.css';

const getMonthRange = (year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  return { startDate, endDate };
};

function BudgetHeader({ monthYear, error }) {
  return (
    <div className="budget-header">
      <h2>Orçamento Mensal - {monthYear}</h2>
      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
}

function BudgetActions({ budgetAmount, isEditing, editValue, onEdit, onChange, onSave, onCancel, onCreate }) {
  return (
    <div className="budget-setup">
      {!isEditing ? (
        <div className="budget-display">
          {budgetAmount > 0 ? (
            <>
              <p className="budget-label">Orçamento definido</p>
              <p className="budget-value">{formatCurrency(budgetAmount)}</p>
              <button className="btn btn-secondary" onClick={onEdit}>
                Editar Orçamento
              </button>
            </>
          ) : (
            <>
              <p className="budget-label">Nenhum orçamento definido</p>
              <button className="btn btn-primary" onClick={onCreate}>
                Definir Orçamento
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="budget-edit">
          <label htmlFor="budget-input">Valor do Orçamento (€)</label>
          <input
            type="number"
            id="budget-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={editValue}
            onChange={onChange}
          />
          <div className="budget-edit-buttons">
            <button className="btn btn-primary" onClick={onSave}>
              Guardar
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetProgress({ totalExpenses, remaining, percentage, isOverBudget }) {
  const displayPercent = Math.round(percentage);

  return (
    <div className="budget-progress">
      <div className="progress-info">
        <div className="progress-stat">
          <span className="stat-label">Restante</span>
          <span className={`stat-value ${isOverBudget ? 'over' : 'remaining'}`}>
            {formatCurrency(remaining)}
          </span>
        </div>
        <div className="progress-stat">
          <span className="stat-label">Gasto</span>
          <span className={`stat-value ${isOverBudget ? 'over' : ''}`}>
            {formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>

      <div className="progress-panel">
        <div className="progress-header">
          <h3>Uso do Orçamento</h3>
          <span className="progress-percentage">{displayPercent}%</span>
        </div>
        <ProgressBar percent={Math.min(displayPercent, 100)} over={isOverBudget} />
        <p className="progress-meta">
          {isOverBudget
            ? `Ultrapassou ${formatCurrency(Math.abs(remaining))}`
            : `Ainda pode gastar ${formatCurrency(remaining)}`}
        </p>
      </div>
    </div>
  );
}

function BudgetPanel({ userId, token, onBudgetUpdated }) {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthYearLabel = formatMonthYear(currentMonth, currentYear);

  useEffect(() => {
    const loadBudgetData = async () => {
      setLoading(true);
      setError(null);

      try {
        const budgetData = await budgetService.getByMonth(userId, currentMonth, currentYear, token);
        const currentBudget = Array.isArray(budgetData) ? budgetData[0] : budgetData;

        if (currentBudget) {
          setBudget(currentBudget);
          setEditValue(String(currentBudget.valor_mensal || 0));
        } else {
          setBudget(null);
          setEditValue('');
        }

        const { startDate, endDate } = getMonthRange(currentYear, currentMonth);
        const expensesData = await expensesService.getByDateRange(userId, startDate, endDate, token);
        setExpenses(Array.isArray(expensesData) ? expensesData : []);
      } catch (err) {
        console.error(err);
        setError(null);
        setBudget(null);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      loadBudgetData();
    }
  }, [userId, token, currentMonth, currentYear]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.valor || 0), 0);
  const budgetAmount = Number(budget?.valor_mensal || 0);
  const remaining = budgetAmount - totalExpenses;
  const percentage = budgetAmount > 0 ? (totalExpenses / budgetAmount) * 100 : 0;
  const isOverBudget = remaining < 0;

  const handleSaveBudget = async () => {
    const amount = parseFloat(editValue);

    if (Number.isNaN(amount) || amount <= 0) {
      setError('Por favor, introduza um valor válido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const budgetData = {
        valor_mensal: amount,
        mes: currentMonth,
        ano: currentYear,
      };

      if (budget && budget.id) {
        await budgetService.update(budget.id, budgetData, token);
        setBudget({ ...budget, ...budgetData });
      } else {
        const createdBudget = await budgetService.create(userId, budgetData, token);
        setBudget(createdBudget);
      }

      setIsEditing(false);
      onBudgetUpdated?.();
    } catch (err) {
      setError(`Erro ao guardar orçamento: ${err.message || 'Desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="budget-container budget-loading">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="budget-container">
      <BudgetHeader monthYear={monthYearLabel} error={error} />
      <BudgetActions
        budgetAmount={budgetAmount}
        isEditing={isEditing}
        editValue={editValue}
        onEdit={() => setIsEditing(true)}
        onCreate={() => {
          setIsEditing(true);
          setEditValue('');
        }}
        onChange={(e) => setEditValue(e.target.value)}
        onSave={handleSaveBudget}
        onCancel={() => setIsEditing(false)}
      />
      {budgetAmount > 0 && (
        <BudgetProgress
          totalExpenses={totalExpenses}
          remaining={remaining}
          percentage={percentage}
          isOverBudget={isOverBudget}
        />
      )}
    </div>
  );
}

export default BudgetPanel;
