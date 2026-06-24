import React, { useCallback, useState } from 'react';
import ExpenseForm from '../componentes/FormularioDespesa';
import ExpenseList from '../componentes/ListaDespesas';
import PopupNotificacao from '../componentes/PopupNotificacao';
import useDataSync from '../ganchos/useSincronizacaoDados';
import '../paginas/Paginas.css';
import './Despesas.css';

function ExpensesPage({ userId, token, refreshTrigger, onExpenseCreated }) {
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', type: 'success' });
  const { notifyUpdate } = useDataSync('expenses', () => {});

  const showPopup = useCallback((title, message, type = 'success') => {
    setPopup({ visible: true, title, message, type });
    window.setTimeout(() => {
      setPopup((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }, 3000);
  }, []);

  const hidePopup = useCallback(() => {
    setPopup((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleExpenseCreated = useCallback(() => {
    if (onExpenseCreated) {
      onExpenseCreated();
    }
    notifyUpdate();
  }, [onExpenseCreated, notifyUpdate]);

  return (
    <div className="page-container expenses-page">
      <PopupNotificacao
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={hidePopup}
      />

      <div className="section-title">
        <div>
          <h2>Despesas</h2>
          <p className="page-description">
            Registe, visualize e gerencie as suas despesas com clareza, mantendo o estilo alinhado ao resto da aplicação.
          </p>
        </div>
      </div>

      <div className="expenses-layout">
        <section className="expenses-form-section">
          <ExpenseForm userId={userId} token={token} onExpenseCreated={handleExpenseCreated} onNotification={showPopup} />
        </section>

        <section className="expenses-list-section">
          <ExpenseList userId={userId} token={token} refreshTrigger={refreshTrigger} />
        </section>
      </div>
    </div>
  );
}

export default ExpensesPage;
