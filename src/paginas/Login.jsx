import { useState } from 'react';
import { authService } from '../servicos/api';
import './Paginas.css';
import './Login.css';

export default function LoginPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar mensagens de erro ao começar a digitar
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email é obrigatório');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }
    if (!formData.password) {
      setError('Palavra-passe é obrigatória');
      return false;
    }
    if (!isLogin && formData.password.length < 6) {
      setError('A palavra-passe deve ter no mínimo 6 caracteres');
      return false;
    }
    if (!isLogin && !formData.nome) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('As palavras-passe não coincidem');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      
      if (isLogin) {
        // Login
        console.log('📝 Tentando login com:', formData.email);
        response = await authService.login(formData.email, formData.password);
        console.log('✅ Login bem-sucedido! Response:', response);
      } else {
        // Registro
        response = await authService.register(
          formData.nome,
          formData.email,
          formData.password
        );
        setSuccess('Conta criada com sucesso! Por favor, faça login.');
        // Limpar formulário e voltar para login
        setFormData({
          email: '',
          password: '',
          nome: '',
          confirmPassword: '',
        });
        setIsLogin(true);
        setTimeout(() => setSuccess(''), 3000);
        return;
      }

      // Guardar token no localStorage
      if (response.token) {
        console.log('💾 Guardando no localStorage...');
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setSuccess('Login realizado com sucesso!');
        setTimeout(() => {
          // Passar também o token para que o App.jsx atualize o estado
          console.log('🔔 Chamando onLoginSuccess com:', response.user);
          onLoginSuccess(response.user, response.token);
        }, 500);
      }
    } catch (err) {
      console.error('❌ Erro no login:', err);
      setError(err.message || 'Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>SaveUp</h1>
            <p>{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Mensagens de erro e sucesso */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Campo Nome - só aparece no registro */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome completo"
                  disabled={loading}
                />
              </div>
            )}

            {/* Campo Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu.email@exemplo.com"
                disabled={loading}
              />
            </div>

            {/* Campo Palavra-passe */}
            <div className="form-group">
              <label htmlFor="password">Palavra-passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite sua palavra-passe"
                disabled={loading}
              />
            </div>

            {/* Campo Confirmar Palavra-passe - só aparece no registro */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Palavra-passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua palavra-passe"
                  disabled={loading}
                />
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={loading}
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          {/* Toggle entre Login e Registro */}
          <div className="login-toggle">
            <p>
              {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setFormData({
                    email: '',
                    password: '',
                    nome: '',
                    confirmPassword: '',
                  });
                }}
                className="toggle-btn"
                disabled={loading}
              >
                {isLogin ? 'Criar Conta' : 'Fazer Login'}
              </button>
            </p>
          </div>
        </div>

        <div className="login-info">
          <div className="info-card">
            <h3>Controle Financeiro</h3>
            <p>Gerencie suas despesas e receitas de forma clara e eficiente.</p>
          </div>
          <div className="info-card">
            <h3>Relatórios</h3>
            <p>Visualize estatísticas e dados do seu perfil financeiro.</p>
          </div>
          <div className="info-card">
            <h3>Simulações</h3>
            <p>Simule depósitos e planeje a sua estratégia financeira.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
