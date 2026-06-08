import { useState, useEffect, useCallback } from 'react';
import { budgetService, expensesService, incomesService } from '../servicos/api';

const getCurrentMonthInfo = (referenceDate = new Date()) => {
  const month = referenceDate.getMonth() + 1;
  const year = referenceDate.getFullYear();
  const monthLabel = referenceDate.toLocaleString('pt-PT', {
    month: 'long',
    year: 'numeric',
  });

  return {
    month,
    year,
    monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
    startDate: `${year}-${String(month).padStart(2, '0')}-01`,
    endDate: new Date(year, month, 0).toISOString().split('T')[0],
  };
};

const getTopCategory = (expenses, totalSpent) => {
  if (!expenses.length || totalSpent === 0) return null;

  const categories = expenses.reduce((acc, expense) => {
    const category = expense.categoria_nome || expense.categoria || 'Outros';
    const value = Number(expense.valor) || 0;

    if (!acc[category]) {
      acc[category] = { total: 0, count: 0 };
    }

    acc[category].total += value;
    acc[category].count += 1;
    return acc;
  }, {});

  return Object.entries(categories)
    .map(([nome, { total, count }]) => ({
      nome,
      total,
      count,
      percentage: ((total / totalSpent) * 100).toFixed(1),
    }))
    .sort((a, b) => b.total - a.total)[0] || null;
};

const getLastDaysTotals = (entries, days = 7) => {
  const today = new Date();
  const daysList = Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));
    const dateKey = date.toISOString().slice(0, 10);
    return {
      key: dateKey,
      label: date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
      total: 0,
    };
  });

  const totalsMap = daysList.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});

  entries.forEach((entry) => {
    const dateKey = entry.data?.slice(0, 10);
    if (dateKey && totalsMap[dateKey]) {
      totalsMap[dateKey].total += Number(entry.valor) || 0;
    }
  });

  return daysList;
};

const safeArray = (data) => (Array.isArray(data) ? data : []);

export default function useDashboardData(userId, token, refreshKey = 0) {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [allIncomes, setAllIncomes] = useState([]);
  const [budget, setBudget] = useState(null);
  const [monthLabel, setMonthLabel] = useState('');
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    if (!userId || !token) {
      setLoading(false);
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { month, year, monthLabel: label, startDate, endDate } = getCurrentMonthInfo();
      setMonthLabel(label);

      const [expensesData, incomesData, budgetData, allExpensesData, allIncomesData] = await Promise.all([
        expensesService.getByDateRange(userId, startDate, endDate, token),
        incomesService.getByDateRange(userId, startDate, endDate, token),
        budgetService.getByMonth(userId, month, year, token),
        expensesService.getAll(userId, token),
        incomesService.getAll(userId, token),
      ]);

      setExpenses(safeArray(expensesData));
      setIncomes(safeArray(incomesData));
      setAllExpenses(safeArray(allExpensesData));
      setAllIncomes(safeArray(allIncomesData));

      const currentBudget = Array.isArray(budgetData) ? budgetData[0] : budgetData;
      setBudget(currentBudget || null);
    } catch (loadError) {
      setError(loadError?.message || 'Erro ao carregar dados do painel');
      setExpenses([]);
      setIncomes([]);
      setBudget(null);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, refreshKey]);

  const totalSpent = expenses.reduce((sum, expense) => sum + (Number(expense.valor) || 0), 0);
  const totalIncomes = incomes.reduce((sum, income) => sum + (Number(income.valor) || 0), 0);
  const previousBalance = Number(budget?.saldo_anterior || 0);
  const monthlyBudget = Number(budget?.valor_mensal || budget?.valor || 0);
  const available = monthlyBudget + totalIncomes + previousBalance - totalSpent;
  const effectiveBudget = monthlyBudget + totalIncomes + previousBalance;
  const rawPercent = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const percent = monthlyBudget > 0 ? Math.min(100, Math.round(rawPercent)) : 0;
  const isOverBudget = available < 0;
  const avgExpenseValue = expenses.length > 0 ? Number((totalSpent / expenses.length).toFixed(2)) : 0;
  const topCategory = getTopCategory(expenses, totalSpent);
  const expenseTrend = getLastDaysTotals(expenses, 7);
  const incomeTrend = getLastDaysTotals(incomes, 7);

  const sortedRecentExpenses = [...allExpenses].sort((a, b) => new Date(b.data) - new Date(a.data));
  const sortedRecentIncomes = [...allIncomes].sort((a, b) => new Date(b.data) - new Date(a.data));

  return {
    loading,
    error,
    expenses,
    incomes,
    budget,
    monthLabel,
    totalSpent,
    totalIncomes,
    previousBalance,
    monthlyBudget,
    available,
    percent,
    rawPercent,
    isOverBudget,
    avgExpenseValue,
    topCategory,
    expenseTrend,
    incomeTrend,
    recentExpenses: sortedRecentExpenses.slice(0, 6),
    recentIncomes: sortedRecentIncomes.slice(0, 6),
    refreshDashboard: loadDashboard,
  };
}
