import React, { useState, useEffect } from 'react';
import { incomesService, incomeCategoriesService } from '../servicos/api';
import './FormularioReceita.css';

export default function IncomeForm({ userId, token, onIncomeCreated, onNotification }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    categoria_id: '',
    origem: '',
    valor: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      try {
        const data = await incomeCategoriesService.getAll(token);
        if (mounted) setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        // silently ignore, keep categories empty
      }
    };

    loadCategories();
    return () => { mounted = false; };
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // validação
      const errs = {};
      const valor = parseFloat(formData.valor);
      if (isNaN(valor) || valor <= 0) errs.valor = 'Introduza um valor maior que 0';
      if (!formData.categoria_id) errs.categoria_id = 'Selecione uma categoria';
      if (!formData.origem || !formData.origem.trim()) errs.origem = 'Indique a origem do rendimento';

      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        setError('Corrija os campos assinalados');
        setLoading(false);
        return;
      }

      const incomeData = {
        valor,
        categoria_id: parseInt(formData.categoria_id, 10),
        origem: formData.origem.trim(),
        data: new Date().toISOString().split('T')[0],
      };

      await incomesService.create(userId, incomeData, token);

      setFormData({
        categoria_id: '',
        origem: '',
        valor: '',
      });
      if (onNotification) {
        onNotification('Rendimento registado', 'Rendimento extra guardado com sucesso!', 'success');
      }

      if (onIncomeCreated) {
        onIncomeCreated();
      }
    } catch (err) {
      const msg = err && err.message ? err.message : 'Erro ao registar rendimento';
      setError(msg);
      if (onNotification) onNotification('Erro', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-module">
      <div className="form-header">
        <h3>Rendimentos Extras</h3>
        <p>Registe um rendimento extra imediatamente, sem passos adicionais.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-body">
        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <div className="form-group">
          <label htmlFor="categoria_id">Categoria</label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleInputChange}
            disabled={loading}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))
            ) : (
              <option value="" disabled>Sem categorias disponíveis</option>
            )}
          </select>
          {fieldErrors.categoria_id && <small className="field-error">{fieldErrors.categoria_id}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="origem">Origem</label>
          <input
            type="text"
            id="origem"
            name="origem"
            value={formData.origem}
            onChange={handleInputChange}
            placeholder="Ex: Venda de artigos, bónus, presente"
            disabled={loading}
            required
          />
          {fieldErrors.origem && <small className="field-error">{fieldErrors.origem}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="valor">Valor (€)</label>
          <input
            type="number"
            id="valor"
            name="valor"
            value={formData.valor}
            onChange={handleInputChange}
            placeholder="Ex: 40"
            step="0.01"
            min="0"
            disabled={loading}
            required
          />
          {fieldErrors.valor && <small className="field-error">{fieldErrors.valor}</small>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Rendimento'}
          </button>
        </div>
      </form>
    </div>
  );
}
