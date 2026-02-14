import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('İnternet bağlantınız geri geldi', {
        id: 'online-status',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('İnternet bağlantınız kesildi', {
        id: 'offline-status',
        duration: Infinity, // Kalıcı göster
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}