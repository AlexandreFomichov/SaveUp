import React, { useState } from 'react';
import './Navegacao.css';
import Logo from './Logo';

/**
 * Componente de Navegação
 * Fornece navegação entre as diferentes seções da aplicação (Despesas, Orçamento, Depósitos)
 */
function Navigation({ activeTab, onTabChange, user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabs = [
    { id: 'home', label: 'Início' },
    { id: 'expenses', label: 'Despesas' },
    { id: 'budget', label: 'Orçamento' },
    { id: 'deposits', label: 'Depósitos' },
  ];

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <Logo />
        </div>
        
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-profile">
            <button 
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={user?.nome}
            >
              <span className="user-avatar">{user?.nome?.charAt(0).toUpperCase() || 'S'}</span>
            </button>
            
            {showUserMenu && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <p className="user-name">{user?.nome}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
                <div className="user-menu-divider"></div>
                <button
                  className="user-menu-item logout-btn"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
