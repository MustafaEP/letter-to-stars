import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tokenUtils } from '../utils/token';
import { Loader2, Sparkles } from 'lucide-react';
import StarField from '../components/ui/Starfield';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Token'ı kaydet
      tokenUtils.set(token);

      // Ana sayfaya yönlendir
      navigate('/diary/calendar', { replace: true });
    } else {
      // Token yoksa login'e geri dön
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <StarField count={150} showShootingStars={true} />
      <div className="relative z-10 text-center glass-card p-8 rounded-2xl animate-pulse-glow">
        <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
        <p className="text-gray-300 text-lg font-medium">Yıldızlara bağlanıyor...</p>
      </div>
    </div>
  );
}