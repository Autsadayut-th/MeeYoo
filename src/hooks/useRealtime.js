import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useRealtime(onSync) {
  useEffect(() => {
    let bc = null;
    if (window.BroadcastChannel) {
      bc = new BroadcastChannel('meeyoo_realtime_sync_v2');
      bc.onmessage = () => {
        if (onSync) onSync();
      };
    }

    const handleStorage = (e) => {
      if (e.key && e.key.startsWith('meeyoo_')) {
        if (onSync) onSync();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, [onSync]);
}
