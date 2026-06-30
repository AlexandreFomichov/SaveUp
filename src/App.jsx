import { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './componentes/Navegacao';
import ExpensesPage from './paginas/Despesas';
import BudgetPage from './paginas/Orcamento';
import DepositsPage from './paginas/Depositos';
import LoginPage from './paginas/Login';
import Home from './paginas/Inicio';
import useDataSync from './ganchos/useSincronizacaoDados';
import { useAuth } from './context/AuthContext';
import './App.css';

/**
 * Componente Principal da Aplicação SaveUp
 * Gestão de despesas, orçamento e depósitos
 */
function App() {
  const { user, token, logout } = useAuth();
  const [refreshExpenses, setRefreshExpenses] = useState(0);
  const [homeRefreshKey, setHomeRefreshKey] = useState(0);

  const handleExpenseCreated = useCallback(() => {
    setRefreshExpenses((prev) => prev + 1);
  }, []);

  const handleGlobalDataUpdate = useCallback(() => {
    setHomeRefreshKey((prev) => prev + 1);
  }, []);

  useDataSync('budget-updated', handleGlobalDataUpdate);
  useDataSync('expenses-updated', handleGlobalDataUpdate);
  useDataSync('incomes-updated', handleGlobalDataUpdate);

  if (!user || !token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Navigation user={user} onLogout={logout} />

      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/"
              element={<Home userId={user.id} token={token} refreshKey={homeRefreshKey} />}
            />
            <Route
              path="/despesas"
              element={
                <ExpensesPage
                  userId={user.id}
                  token={token}
                  refreshTrigger={refreshExpenses}
                  onExpenseCreated={handleExpenseCreated}
                />
              }
            />
            <Route path="/orcamento" element={<BudgetPage userId={user.id} token={token} />} />
            <Route path="/depositos" element={<DepositsPage userId={user.id} token={token} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 SaveUp - Gestão de Despesas Pessoais</p>
      </footer>
    </div>
  );
}

export default App;
