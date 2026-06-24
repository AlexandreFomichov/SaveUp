import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navegacao.css';
import Logo from './Logo';

/**
 * Componente de Navegação
 * Fornece navegação entre as diferentes seções da aplicação (Despesas, Orçamento, Depósitos)
 */
function Navigation({ user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPagesMenu, setShowPagesMenu] = useState(false);

  const tabs = [
    {
      path: '/',
      label: 'Início',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11.5L12 4l9 7.5" />
          <path d="M5 21h14a1 1 0 0 0 1-1V11" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      path: '/despesas',
      label: 'Despesas',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      path: '/orcamento',
      label: 'Orçamento',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="10" width="4" height="8" />
          <rect x="10" y="6" width="4" height="12" />
          <rect x="16" y="2" width="4" height="16" />
        </svg>
      ),
    },
    {
      path: '/depositos',
      label: 'Depósitos',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="10" r="4" />
          <path d="M8 20c1-1 3-2 4-2s3 1 4 2" />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  return (
    <nav className="navigation" aria-label="Menu principal">
      <div className="nav-container">
        <div className="nav-logo">
          <Logo />
        </div>

        <div className="nav-tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
              end={tab.path === '/'}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-user">
          <div className="pages-menu-wrapper">
            <button
              className="pages-menu-btn"
              onClick={() => setShowPagesMenu(!showPagesMenu)}
              title="Menu de Páginas"
              aria-expanded={showPagesMenu}
              aria-haspopup="true"
            >
              <span className="menu-icon">☰</span>
            </button>

            {showPagesMenu && (
              <div className="pages-dropdown" role="menu">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className="pages-dropdown-item"
                    onClick={() => setShowPagesMenu(false)}
                  >
                    <span className="dropdown-icon">{tab.icon}</span>
                    {tab.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div className="user-profile">
            <button
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={user?.nome}
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <span className="user-avatar">{user?.nome?.charAt(0).toUpperCase() || 'S'}</span>
            </button>

            {showUserMenu && (
              <div className="user-menu" role="menu">
                <div className="user-menu-header">
                  <p className="user-name">{user?.nome}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
                <div className="user-menu-divider"></div>
                <button
                  className="user-menu-item logout-btn"
                  onClick={handleLogout}
                  role="menuitem"
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
