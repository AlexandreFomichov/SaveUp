import React from 'react';
import './Logo.css';

/**
 * Componente de Logo
 * Exibe a logo da aplicação SaveUp
 */
function Logo({ className = '', size = 'medium' }) {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large'
  };

  return (
    <div className={`logo-wrapper ${sizeClasses[size]} ${className}`}>
      {!imageError ? (
        <img 
          src="/src/assets/images/Logo SaveUp - PAP.png" 
          alt="Logo SaveUp" 
          className="logo-image"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="logo-fallback">
          <span className="logo-fallback-text">SaveUp</span>
        </div>
      )}
    </div>
  );
}

export default Logo;
