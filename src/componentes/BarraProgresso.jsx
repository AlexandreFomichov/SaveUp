import React from 'react';
import './BarraProgresso.css';

export default function ProgressBar({ percent = 0, over = false }) {
  return (
    <div className="progress-wrap">
      <div className="progress-bg">
        <div className={`progress-fill ${over ? 'over' : ''}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}