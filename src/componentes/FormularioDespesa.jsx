import React, { useState, useEffect } from 'react';
import { expensesService, categoriesService } from '../servicos/api';
import './FormularioDespesa.css';

/**
 * Componente de Formulário de Despesa
 * Permite ao utilizador criar uma nova despesa
 */
function ExpenseForm({ userId, token, onExpenseCreated, onNotification }) {
  const [formData, setFormData] = useState({
    categoria_id: '',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Carregar categorias ao montar o componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('📦 Carregando categorias do API...');
        const data = await categoriesService.getAll(token);
        console.log('✅ Categorias recebidas:', data);
        setCategories(data || []);
      } catch (err) {
        setError('Erro ao carregar categorias');
        console.error('❌ Erro ao carregar categorias:', err);
      }
    };

    if (token) {
      console.log('🔑 Token existe:', token.substring(0, 20) + '...');
      loadCategories();
    } else {
      console.log('⚠️  Sem token - não carregando categorias');
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // limpar erro do campo ao alterar
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação de campos
    const errs = {};
    if (!formData.categoria_id) errs.categoria_id = 'Selecione uma categoria';
    if (!formData.descricao || !formData.descricao.trim()) errs.descricao = 'Descrição é obrigatória';
    const valorNum = parseFloat(formData.valor);
    if (isNaN(valorNum) || valorNum <= 0) errs.valor = 'Insira um valor positivo';
    if (!formData.data) errs.data = 'Data é obrigatória';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError('Corrija os campos assinalados');
      setLoading(false);
      return;
    }

    try {
      const expenseData = {
        categoria_id: parseInt(formData.categoria_id),
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        data: formData.data,
      };

      await expensesService.create(userId, expenseData, token);
      
      // Limpar formulário
      setFormData({
        categoria_id: '',
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
      });

      if (onNotification) {
        onNotification('Despesa adicionada', 'Despesa guardada com sucesso!', 'success');
      }

      // Callback para atualizar a lista de despesas
      if (onExpenseCreated) {
        onExpenseCreated();
      }
    } catch (err) {
      const msg = err && err.message ? err.message : 'Erro ao guardar despesa';
      setError(msg);
      console.error('Erro ao criar despesa:', err);
      if (onNotification) onNotification('Erro', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-module">
      <div className="form-header">
        <h3>Nova Despesa</h3>
        <p>Registe uma despesa rapidamente para manter o orçamento atualizado.</p>
      </div>

      <form className="form-body" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error" role="alert">{error}</div>}

        <div className="form-group">
          <label htmlFor="categoria_id">Categoria</label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
          {fieldErrors.categoria_id && <small className="field-error">{fieldErrors.categoria_id}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <input
            type="text"
            id="descricao"
            name="descricao"
            placeholder="Ex: Compras no supermercado"
            value={formData.descricao}
            onChange={handleInputChange}
            required
          />
          {fieldErrors.descricao && <small className="field-error">{fieldErrors.descricao}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="data">Data</label>
          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleInputChange}
            required
          />
          {fieldErrors.data && <small className="field-error">{fieldErrors.data}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="valor">Valor (€)</label>
          <input
            type="number"
            id="valor"
            name="valor"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.valor}
            onChange={handleInputChange}
            required
          />
          {fieldErrors.valor && <small className="field-error">{fieldErrors.valor}</small>}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Despesa'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
