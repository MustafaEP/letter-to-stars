import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tokenUtils } from '../utils/token';
import { Loader2 } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Giriş yapılıyor...</p>
      </div>
    </div>
  );
}