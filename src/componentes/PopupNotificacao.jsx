import React, { useEffect, useRef } from 'react';
import './PopupNotificacao.css';

export default function PopupNotificacao({
  visible,
  title,
  message,
  type = 'success',
  onClose,
  actionLabel,
  onAction,
  autoCloseDuration = null, // null = permanent, number = milliseconds before auto-close
}) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!visible || !autoCloseDuration) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Set auto-close timeout
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [visible, autoCloseDuration, onClose]);

  if (!visible) return null;

  const icon = type === 'error' ? '!' : '✓';

  return (
    <div className="popup-toast-container" role="status" aria-live="polite" aria-label={title}>
      <div className={`popup-card popup-${type}`}>
        <button type="button" className="popup-close" onClick={onClose} aria-label="Fechar notificação">×</button>
        <div className="popup-body">
          <div className="popup-icon">{icon}</div>
          <div className="popup-content">
            <h3>{title}</h3>
            <p>{message}</p>
            {actionLabel && onAction && (
              <div className="popup-actions">
                <button type="button" className="popup-action-btn" onClick={onAction}>
                  {actionLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
