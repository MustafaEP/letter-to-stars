import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-auto glass-card border border-red-500/50 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-slide-up">
      <div className="p-2 bg-red-500/20 rounded-lg">
        <WifiOff className="w-5 h-5 text-red-400 flex-shrink-0" />
      </div>
      <div>
        <p className="font-bold text-red-400">İnternet bağlantısı yok</p>
        <p className="text-sm text-gray-400">Bağlantı sağlanınca otomatik devam edecek</p>
      </div>
    </div>
  );
}