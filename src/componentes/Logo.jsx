import React from 'react';
import './Logo.css';

/**
 * Componente de Logo
 * Exibe a logo da aplicação SaveUp em CSS/JSX
 */
function Logo({ className = '', size = 'medium' }) {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  };

  return (
    <div className={`logo-wrapper ${sizeClasses[size]} ${className}`}>
      <div className="logo-badge" aria-hidden="true">
        <span className="logo-mark">S</span>
      </div>

      {size !== 'small' && (
        <div className="logo-text">
          <span className="logo-text-main">Save</span>
          <span className="logo-text-accent">Up</span>
        </div>
      )}
    </div>
  );
}

export default Logo;
