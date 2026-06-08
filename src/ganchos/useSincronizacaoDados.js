/**
 * Hook para sincronizar dados entre diferentes páginas/abas
 * Usa localStorage e eventos de visibilidade da página para comunicação
 */
import { useEffect, useCallback } from 'react';

const DATA_SYNC_EVENT = 'saveup:data-sync';
const STORAGE_KEY = 'saveup:data-sync-timestamp';

export function useDataSync(key, onUpdate) {
  // Notificar outras abas/janelas que houve uma atualização
  const notifyUpdate = useCallback(() => {
    const timestamp = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ key, timestamp }));
    window.dispatchEvent(
      new CustomEvent(DATA_SYNC_EVENT, { detail: { key, timestamp } })
    );
  }, [key]);

  // Escutar atualizações
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY) {
        try {
          const data = JSON.parse(event.newValue);
          if (data.key === key) {
            onUpdate();
          }
        } catch (error) {
          console.error('Erro ao processar sincronização:', error);
        }
      }
    };

    const handleCustomEvent = (event) => {
      if (event.detail.key === key) {
        onUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(DATA_SYNC_EVENT, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(DATA_SYNC_EVENT, handleCustomEvent);
    };
  }, [key, onUpdate]);

  return { notifyUpdate };
}

export default useDataSync;
