import React, { useState, useRef, useEffect } from 'react';
import './MenuSuspenso.css';

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    const btn = ref.current?.querySelector('.drop-btn');
    if (!btn) return;

    const updatePosition = () => {
      const rect = btn.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      const top = rect.bottom + 8;

      setMenuStyle({
        left: isMobile ? '50%' : '12px',
        top: `${top}px`,
        transform: isMobile ? 'translateX(-50%)' : 'none',
      });
    };

    updatePosition();

    function onResize() {
      updatePosition();
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
    };
  }, [open]);

  return (
    <div className="dropdown" ref={ref}>
      <button className="drop-btn" onClick={() => setOpen((s) => !s)}>Menu ▾</button>
      {open && (
        <div className="drop-list" style={{ position: 'fixed', left: menuStyle?.left, top: menuStyle?.top }}>
          <a href="/expenses">Despesas</a>
          <a href="/budget">Orçamento</a>
          <a href="/deposits">Depósitos</a>
          <a href="/settings">Configurações</a>
        </div>
      )}
    </div>
  );
}