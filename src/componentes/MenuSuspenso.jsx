import React, { useState, useRef, useEffect } from 'react';
import './MenuSuspenso.css';

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button className="drop-btn" onClick={() => setOpen((s) => !s)}>Menu ▾</button>
      {open && (
        <div className="drop-list">
          <a href="/expenses">Despesas</a>
          <a href="/budget">Orçamento</a>
          <a href="/deposits">Depósitos</a>
          <a href="/settings">Configurações</a>
        </div>
      )}
    </div>
  );
}