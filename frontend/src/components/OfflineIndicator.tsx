import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up">
      <WifiOff className="w-5 h-5 flex-shrink-0" />
      <div>
        <p className="font-medium">İnternet bağlantısı yok</p>
        <p className="text-sm opacity-90">Bağlantı sağlanınca otomatik devam edecek</p>
      </div>
    </div>
  );
}