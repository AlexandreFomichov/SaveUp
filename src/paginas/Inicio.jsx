import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from '../componentes/BarraProgresso';
import DropdownMenu from '../componentes/MenuSuspenso';
import ExpenseForm from '../componentes/FormularioDespesa';
import IncomeForm from '../componentes/FormularioReceita';
import PopupNotificacao from '../componentes/PopupNotificacao';
import useDashboardData from '../ganchos/useDashboardData';
import useDataSync from '../ganchos/useSincronizacaoDados';
import { incomeCategoriesService } from '../servicos/api';
import { formatCurrency, formatDate } from '../utilitarios/formatadores';
import './Inicio.css';

// Mapa de categorias para ícones/símbolos simples e finos
const CATEGORY_ICONS = {
  // Despesas
  'Alimentação': '◉',    // Círculo preenchido = prato
  'Transporte': '→',     // Seta = movimento/deslocação
  'Saúde': '+',          // Cruz = médico/farmácia
  'Educação': '▢',       // Quadrado = instituição/estrutura
  'Entretenimento': '◇', // Diamante vazio = diversão/especial
  'Moradia': '⌂',        // Casa = casa
  'Outros': '•',         // Ponto = genérico
  
  // Rendimentos
  'Freelance': '∞',      // Infinito = trabalho contínuo
  'Bónus': '▲',          // Triângulo para cima = crescimento/ganho
  'Vendas de Artigos': '◆', // Diamante preenchido = valor/mercadoria
  'Outros': '•',         // Ponto = genérico
};

const getIconForCategory = (categoryName) => {
  if (!categoryName) return '○';
  return CATEGORY_ICONS[categoryName] || CATEGORY_ICONS['Outros'];
};

function BudgetOverview({ monthlyBudget, totalSpent, totalIncomes, available, percent, isOverBudget, topCategory, topIncome, expenseTrend }) {
  const [mode, setMode] = useState('expense'); // 'expense' or 'income'
  const [animating, setAnimating] = useState(false);

  const current = mode === 'expense' ? topCategory : topIncome;
  const currentShare = current
    ? Math.round(
        ((mode === 'expense' ? current.total : current.total) /
          (mode === 'expense' ? Math.max(totalSpent, 1) : Math.max(totalIncomes, 1))) *
          100,
      )
    : 0;

  const handleToggle = () => {
    setAnimating(true);
    // fade out, swap, fade in
    window.setTimeout(() => {
      setMode((m) => (m === 'expense' ? 'income' : 'expense'));
      setTimeout(() => setAnimating(false), 220);
    }, 180);
  };

  return (
    <section className="home-section home-budget">
      {isOverBudget && (
        <div className="budget-alert budget-alert-danger">
          <div className="budget-alert-icon"></div>
          <div className="budget-alert-content">
            <h4>Orçamento Excedido</h4>
            <p>Ultrapassou o orçamento mensal em <strong>{formatCurrency(totalSpent - monthlyBudget)}</strong></p>
          </div>
        </div>
      )}

      <div className="budget-card card">
        <div className="budget-info">
          <div className="budget-item budget-monthly-only">
            <span className="label">Orçamento Mensal</span>
            <strong className="value">{formatCurrency(monthlyBudget)}</strong>
          </div>

          <div className="budget-item budget-spent-only">
            <span className="label">Despesas Realizadas</span>
            <strong className="value negative">{formatCurrency(totalSpent)}</strong>
          </div>

          <div className="budget-item budget-remaining-only">
            <span className="label">Orçamento Restante</span>
            <strong className={`value ${available >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(available)}
            </strong>
          </div>

          <div className="budget-item budget-income-only">
            <span className="label">Rendimentos Extra</span>
            <strong className="value positive">{formatCurrency(totalIncomes)}</strong>
          </div>

          <div className="budget-item budget-category">
            <div className="budget-category-left">
              <span className="label">
                {mode === 'expense' ? 'Categoria com maior gasto' : 'Rendimento extra com maior ganho'}
              </span>

              {current ? (
                <>
                  <strong className={`value category-value ${animating ? 'fade-out' : 'fade-in'}`}>
                    {current.nome}
                  </strong>

                  <div className="category-chart">
                    <div className="category-chart-meta">
                      <span>{mode === 'expense' ? 'Parte das despesas' : 'Parte das receitas'}</span>
                      <strong>{currentShare}%</strong>
                    </div>
                    <div className="category-chart-bar">
                      <div className="category-chart-fill" style={{ width: `${currentShare}%` }} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="budget-category-placeholder">
                  <strong className="value">Sem registos ainda</strong>
                  <p className="category-placeholder-text">
                    Adicione uma despesa ou um rendimento extra para ver a categoria em destaque.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className={`category-toggle ${animating ? 'busy' : ''}`}
              onClick={handleToggle}
              aria-label="Alternar categoria/ganho"
            >
              <span className={`toggle-icon ${mode === 'income' ? 'rotate' : ''}`}>⇄</span>
            </button>
          </div>
        </div>

        <div className="budget-right">
          <div className="progress-panel">
            <div className="progress-header">
              <h3>Uso do Orçamento</h3>
              <span className="progress-percentage">{percent}%</span>
            </div>
            <ProgressBar percent={percent} over={isOverBudget} />
            <p className="progress-meta">
              {isOverBudget
                ? `Ultrapassou ${formatCurrency(totalSpent - monthlyBudget)}`
                : `Ainda pode gastar ${formatCurrency(available)}`}
            </p>
          </div>

          <div className="budget-trend-card card">
            <div className="trend-label-group">
              <span className="trend-label">Últimos 7 dias</span>
              <strong>{formatCurrency(expenseTrend.reduce((sum, item) => sum + item.total, 0))}</strong>
            </div>
            <div className="trend-chart-inline">
              {expenseTrend.map((item) => {
                const width = Math.round((item.total / Math.max(...expenseTrend.map((row) => row.total), 1)) * 100);
                return (
                  <div key={item.key} className="trend-bar-inline">
                    <span className="trend-bar-inline-label">{item.label}</span>
                    <div className="trend-bar-track-inline">
                      <div className="trend-bar-fill" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function QuickActions({ userId, token, onExpenseCreated, onIncomeCreated, onNotification }) {
  return (
    <section className="home-section home-actions">
      <div className="home-actions-grid">
        <div className="card action-card">
          <ExpenseForm
            userId={userId}
            token={token}
            onExpenseCreated={onExpenseCreated}
            onNotification={onNotification}
          />
        </div>

        <div className="card action-card">
          <IncomeForm
            userId={userId}
            token={token}
            onIncomeCreated={onIncomeCreated}
            onNotification={onNotification}
          />
        </div>
      </div>
    </section>
  );
}

function TransactionsSection({ recentExpenses, recentIncomes }) {
  return (
    <section className="home-section home-transactions">
      <div className="transactions-grid">
        <div className="card transactions-card">
          <div className="transactions-header">
            <h3>Despesas Recentes</h3>
            <span className="card-count">{recentExpenses.length}</span>
          </div>
          <ul className="transactions-list">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense, index) => (
                <li
                  key={expense.id ?? expense._id ?? `expense-${index}`}
                  className="transaction-item expense"
                >
                  <div className="trans-info">
                    <span className="trans-category">
                      {expense.categoria_nome || expense.categoria || 'Outras'}
                    </span>
                    <span className="trans-desc">{expense.descricao || 'Sem descrição'}</span>
                  </div>
                  <div className="trans-right">
                    <span className="trans-value">-{formatCurrency(Number(expense.valor) || 0)}</span>
                    <span className="trans-date">{formatDate(expense.data || new Date())}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="empty-state">Nenhuma despesa registada neste mês.</li>
            )}
          </ul>
        </div>

        <div className="card transactions-card">
          <div className="transactions-header">
            <h3>Últimos Rendimentos Extra</h3>
            <span className="card-count">{recentIncomes.length}</span>
          </div>
          <ul className="transactions-list">
            {recentIncomes.length > 0 ? (
              recentIncomes.map((income, index) => (
                <li
                  key={income.id ?? income._id ?? `income-${index}`}
                  className="transaction-item income"
                >
                  <div className="trans-info">
                    <span className="trans-category">
                      {income.categoria_nome || 'Categoria'}
                    </span>
                    <span className="trans-desc">{income.origem || 'Sem origem'}</span>
                  </div>
                  <div className="trans-right">
                    <span className="trans-value positive">+{formatCurrency(Number(income.valor) || 0)}</span>
                    <span className="trans-date">{formatDate(income.data || new Date())}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="empty-state">Nenhum rendimento registado neste mês.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

function InsightsSection({ expensesLength, avgExpenseValue, monthlyBudget, percent }) {
  if (!expensesLength) return null;

  return (
    <section className="home-section home-insights">
      <div className="insights-grid">
        <div className="insight-card">
          <h4>Gasto Médio</h4>
          <p className="insight-value">{formatCurrency(Number(avgExpenseValue) || 0)}</p>
          <span className="insight-label">por transação</span>
        </div>

        <div className="insight-card">
          <h4>Total de Transações</h4>
          <p className="insight-value">{expensesLength}</p>
          <span className="insight-label">este mês</span>
        </div>

        {monthlyBudget > 0 && (
          <div className="insight-card">
            <h4>Orçamento Utilizado</h4>
            <p className="insight-value">{percent}%</p>
            <span className="insight-label">{percent > 100 ? 'excedido' : 'disponível'}</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home({ userId, token, refreshKey = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const budgetPromptShownRef = useRef(false);

  const [refreshKeyLocal, setRefreshKeyLocal] = useState(0);
  const [popup, setPopup] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success',
    actionLabel: '',
    onAction: null,
    autoCloseDuration: null,
  });
  const [incomeCategories, setIncomeCategories] = useState([]);

  const handleRefresh = useCallback(() => {
    setRefreshKeyLocal((prev) => prev + 1);
  }, []);

  // Carregar categorias de rendimento
  React.useEffect(() => {
    if (!token) return;
    const loadIncomeCategories = async () => {
      try {
        const data = await incomeCategoriesService.getAll(token);
        setIncomeCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao carregar categorias de rendimento:', err);
      }
    };
    loadIncomeCategories();
  }, [token]);

  const showPopup = useCallback((title, message, type = 'success', actionLabel = '', onAction = null, autoCloseDuration = null) => {
    setPopup({
      visible: true,
      title,
      message,
      type,
      actionLabel,
      onAction,
      autoCloseDuration,
    });
  }, []);

  // Wrapper para popups de despesa/receita que desaparecem em 3 segundos
  const showPopupWithAutoClose = useCallback((title, message, type = 'success') => {
    showPopup(title, message, type, '', null, 3000);
  }, [showPopup]);

  const hidePopup = useCallback(() => {
    setPopup((prev) => ({ ...prev, visible: false }));
  }, []);

  const handlePopupAction = useCallback(() => {
    if (popup.onAction) {
      popup.onAction();
    }
    hidePopup();
  }, [hidePopup, popup]);

  useEffect(() => {
    if (budgetPromptShownRef.current) return;

    const showBudgetPrompt =
      location.state?.showBudgetPopup === true ||
      localStorage.getItem('pendingBudgetSetup') === 'true';

    if (!showBudgetPrompt) return;

    budgetPromptShownRef.current = true;
    localStorage.removeItem('pendingBudgetSetup');

    // Schedule popup on next tick to avoid cascading renders warning
    const timer = setTimeout(() => {
      setPopup({
        visible: true,
        title: 'Defina o seu orçamento',
        message: 'Clique no botão abaixo para configurar o seu orçamento mensal e começar a controlar as suas finanças.',
        type: 'success',
        actionLabel: 'Ir para Orçamento',
        onAction: () => navigate('/orcamento'),
        autoCloseDuration: null,
      });
    }, 0);

    if (location.state?.showBudgetPopup) {
      navigate(location.pathname, { replace: true, state: null });
    }

    return () => clearTimeout(timer);
  }, [location.pathname, location.state, navigate]);

  useDataSync('budget-updated', handleRefresh);
  const { notifyUpdate: notifyExpenseUpdate } = useDataSync('expenses-updated', handleRefresh);
  const { notifyUpdate: notifyIncomeUpdate } = useDataSync('incomes-updated', handleRefresh);

  const {
    loading,
    error,
    expenses,
    incomes,
    totalSpent,
    totalIncomes,
    monthlyBudget,
    available,
    percent,
    isOverBudget,
    avgExpenseValue,
    topCategory,
    expenseTrend,
    recentExpenses,
    recentIncomes,
  } = useDashboardData(userId, token, refreshKey + refreshKeyLocal);

  const enrichIncomes = (incomesData) => {
    return incomesData.map((income) => ({
      ...income,
      categoria_nome: incomeCategories.find((cat) => cat.id === income.categoria_id)?.nome || income.categoria_nome,
    }));
  };

  const enrichedIncomes = enrichIncomes(incomes);

  const getTopIncome = (incomesList) => {
    if (!incomesList || incomesList.length === 0) return null;
    const grouped = incomesList.reduce((acc, inc) => {
      const key = inc.categoria_nome || inc.categoria || inc.origem || 'Outras';
      const value = Number(inc.valor) || 0;
      if (!acc[key]) acc[key] = { nome: key, total: 0, count: 0 };
      acc[key].total += value;
      acc[key].count += 1;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => b.total - a.total)[0] || null;
  };

  const topIncome = getTopIncome(enrichedIncomes);

  const enrichedRecentIncomes = enrichIncomes(recentIncomes);

  const handleExpenseCreated = useCallback(() => {
    handleRefresh();
    notifyExpenseUpdate();
  }, [handleRefresh, notifyExpenseUpdate]);

  const handleIncomeCreated = useCallback(() => {
    handleRefresh();
    notifyIncomeUpdate();
  }, [handleRefresh, notifyIncomeUpdate]);

  if (loading) {
    return <div className="home-page"><p>Carregando...</p></div>;
  }

  return (
    <div className="home-page">
      <PopupNotificacao
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={hidePopup}
        actionLabel={popup.actionLabel}
        onAction={handlePopupAction}
        autoCloseDuration={popup.autoCloseDuration}
      />

      <div className="section-title">
        <div>
          <h2>Início</h2>
          <p className="page-description">Visão geral do seu orçamento, transações recentes e ações rápidas.</p>
        </div>
      </div>

      <BudgetOverview
        monthlyBudget={monthlyBudget}
        totalSpent={totalSpent}
        totalIncomes={totalIncomes}
        available={available}
        percent={percent}
        isOverBudget={isOverBudget}
        topCategory={topCategory}
        topIncome={topIncome}
        expenseTrend={expenseTrend}
      />

      <QuickActions
        userId={userId}
        token={token}
        onExpenseCreated={handleExpenseCreated}
        onIncomeCreated={handleIncomeCreated}
        onNotification={showPopupWithAutoClose}
      />

      <TransactionsSection recentExpenses={recentExpenses} recentIncomes={enrichedRecentIncomes} />

      <InsightsSection
        expensesLength={expenses.length}
        avgExpenseValue={avgExpenseValue}
        monthlyBudget={monthlyBudget}
        percent={percent}
      />

      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
}
