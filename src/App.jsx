import { useState, useCallback } from 'react';
import Navigation from './componentes/Navegacao';
import ExpensesPage from './paginas/Despesas';
import BudgetPage from './paginas/Orcamento';
import DepositsPage from './paginas/Depositos';
import LoginPage from './paginas/Login';
import Home from './paginas/Inicio';
import useDataSync from './ganchos/useSincronizacaoDados';
import './App.css';

/**
 * Componente Principal da Aplicação SaveUp
 * Gestão de despesas, orçamento e depósitos
 */
function App() {
  // Estado de autenticação (inicializado a partir do localStorage)
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('authToken');
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } catch {
        // ignore
      }
      return null;
    }
  });

  

  // Estado da aplicação
  const [activeTab, setActiveTab] = useState('home');
  const [refreshExpenses, setRefreshExpenses] = useState(0);
  const [homeRefreshKey, setHomeRefreshKey] = useState(0);

  // Nota: a autenticação é inicializada diretamente a partir do localStorage

  // Callback para handleLoginSuccess (recebe user e token)
  const handleLoginSuccess = (userData, tokenData) => {
    console.log('🔐 handleLoginSuccess chamado com:');
    console.log('  - userData:', userData);
    console.log('  - tokenData:', tokenData ? 'Existe' : 'Não existe');
    
    setUser(userData);
    if (tokenData) {
      setToken(tokenData);
      try {
        localStorage.setItem('authToken', tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ localStorage atualizado com sucesso');
      } catch (e) {
        console.error('Erro ao gravar localStorage:', e);
      }
    }
  };

  // Callback para logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setActiveTab('home');
  }, []);

  // Callback para atualizar lista de despesas após criar uma nova
  const handleExpenseCreated = useCallback(() => {
    setRefreshExpenses((prev) => prev + 1);
  }, []);

  // Callback para atualizar Home quando dados globais são modificados
  const handleGlobalDataUpdate = useCallback(() => {
    setHomeRefreshKey((prev) => prev + 1);
  }, []);

  // Sincronizar dados entre abas
  useDataSync('budget-updated', handleGlobalDataUpdate);
  useDataSync('expenses-updated', handleGlobalDataUpdate);

  // Se não está autenticado, mostrar página de login
  if (!user || !token) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="content-wrapper">
          {activeTab === 'home' && (
            <div className="tab-content">
              <Home userId={user.id} token={token} refreshKey={homeRefreshKey} />
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="tab-content">
              <ExpensesPage
                userId={user.id}
                token={token}
                refreshTrigger={refreshExpenses}
                onExpenseCreated={handleExpenseCreated}
              />
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="tab-content">
              <BudgetPage userId={user.id} token={token} />
            </div>
          )}

          {activeTab === 'deposits' && (
            <div className="tab-content">
              <DepositsPage userId={user.id} token={token} />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 SaveUp - Gestão de Despesas Pessoais</p>
      </footer>
    </div>
  );
}

export default App;
