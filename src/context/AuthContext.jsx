import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.warn('Falha ao ler usuário do localStorage:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    return null;
  }
};

const getStoredToken = () => {
  try {
    const token = localStorage.getItem('authToken');
    return token ? token.trim() : null;
  } catch (error) {
    console.warn('Falha ao ler token do localStorage:', error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());

  useEffect(() => {
    if (user && token) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', token);
      } catch (error) {
        console.warn('Falha ao gravar autenticação no localStorage:', error);
      }
    }
  }, [user, token]);

  const login = useCallback((userData, tokenData) => {
    const normalizedToken = typeof tokenData === 'string' ? tokenData.trim() : tokenData;
    setUser(userData);
    setToken(normalizedToken);
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', normalizedToken);
    } catch (error) {
      console.warn('Falha ao gravar autenticação no localStorage:', error);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.warn('Falha ao limpar localStorage:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
