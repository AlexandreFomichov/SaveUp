import React from 'react';
import './Logo.css';

/**
 * Componente de Logo
 * Exibe a logo da aplicação SaveUp com estilo de degradê verde
 */
function Logo({ className = '', size = 'medium' }) {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  };

  return (
    <div className={`logo-wrapper ${sizeClasses[size]} ${className}`}>
      <svg
        className="logo-svg"
        viewBox="0 0 100 100"
        role="img"
        aria-label="SaveUp logo"
      >
        <defs>
          <linearGradient id="saveupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-green-dark)" />
            <stop offset="45%" stopColor="var(--color-green-primary)" />
            <stop offset="100%" stopColor="var(--color-green-light)" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="46" fill="url(#saveupGradient)" />

        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="42"
          fontWeight="600"
          fill="#fff"
        >
          $
        </text>

        <path
          d="M74 18 L74 34"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M70 22 L74 18 L78 22"
          fill="none"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default Logo;
